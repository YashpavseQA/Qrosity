from django.shortcuts import render
from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser
from django_filters.rest_framework import DjangoFilterBackend
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import os
import logging

logger = logging.getLogger(__name__)

from core.viewsets import TenantModelViewSet
from django.utils.text import slugify
from products.models import (
    Product, ProductImage, ProductVariant, KitComponent, 
    PRODUCT_TYPE_CHOICES, PublicationStatus
)
from products.serializers import (
    ProductSerializer, 
    ProductImageSerializer, ProductVariantSerializer,
    KitComponentSerializer
)
from products.filters import ProductFilter


class ProductViewSet(TenantModelViewSet):
    """
    ViewSet for managing products.
    
    This viewset provides CRUD operations for the Product model,
    including related attribute values and images.
    """
    serializer_class = ProductSerializer
    permission_classes = []  # Authentication temporarily disabled
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'sku', 'description', 'short_description']
    ordering_fields = ['name', 'created_at', 'updated_at', 'display_price']
    ordering = ['id']
    http_method_names = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options']
    
    def get_queryset(self):
        """
        Get the list of items for this view.
        
        This method should always be used rather than accessing self.queryset directly,
        as self.queryset gets evaluated only once, and those results are cached for all
        subsequent requests.
        """
        # For development/testing, use client_id filtering instead of tenant
        # In production, this would use proper tenant isolation
        client_id = getattr(self.request, 'tenant', None)
        
        if client_id is None:
            # Default to client_id=1 for development
            client_id = 1
            logger.info(f"No tenant found in request, using default client_id={client_id}")
        
        # Base filtering using client_id
        queryset = Product.objects.filter(client_id=client_id)
        
        # Apply necessary select_related/prefetch_related for performance
        queryset = queryset.select_related(
            'category', 'subcategory', 'productstatus', 'uom'
        ).prefetch_related(
            'images', 
            'attribute_values__attribute', 
            'attribute_values__value_option',
            'attribute_values__multi_values__attribute_option',
            'attribute_groups',
            'variant_defining_attributes'
        )
        
        # Log the query and count for debugging
        logger.info(f"Product query: {queryset.query}")
        logger.info(f"Product count: {queryset.count()}")
        
        return queryset
        
    def list(self, request, *args, **kwargs):
        """
        List all products for the tenant.
        
        This method overrides the default list method to ensure proper pagination
        and to add additional debugging information.
        """
        queryset = self.filter_queryset(self.get_queryset())
        
        # Log the filtered queryset count
        logger.info(f"Filtered product count: {queryset.count()}")
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            logger.info(f"Returning {len(serializer.data)} products with pagination")
            return self.get_paginated_response(serializer.data)
            
        serializer = self.get_serializer(queryset, many=True)
        logger.info(f"Returning {len(serializer.data)} products without pagination")
        return Response(serializer.data)

    def get_serializer_context(self):
        """
        Add client information to the serializer context.
        """
        context = super().get_serializer_context()
        
        # Attempt to get client from request
        try:
            # First try to get client from request
            client = self.request.tenant if hasattr(self.request, 'tenant') else None
        except AttributeError:
            client = None
        
        # If no client found, try to get from authentication
        if not client and hasattr(self.request, 'user') and self.request.user.is_authenticated:
            from tenants.models import Tenant
            try:
                client = Tenant.objects.filter(users=self.request.user).first()
            except Exception:
                client = None
        
        # If still no client, use a default
        if not client:
            from tenants.models import Tenant
            client = Tenant.objects.first()
        
        # Add client to context
        context['client'] = client
        context['request'] = self.request
        
        return context
    
    def create(self, request, *args, **kwargs):
        """
        Create a new product.
        
        POST /api/v1/products/
        
        Args:
            request (Request): Request object containing product data
            
        Returns:
            Response: Created product data with 201 status code
        """
        print(f"Received POST request to create product: {request.data}")
        
        # Get client information
        client = getattr(self.request, 'tenant', None)
        client_id = getattr(client, 'id', 1)
        company_id = getattr(client, 'company_id', 1)
        
        # Handle foreign key fields with _id suffix
        data = request.data.copy()
        for field in ['division', 'uom', 'productstatus', 'default_tax_rate_profile']:
            field_id = f'{field}_id'
            if field_id in data:
                data[field] = data.pop(field_id)
                
        # Ensure default_tax_rate_profile is properly handled
        if 'default_tax_rate_profile' in data:
            logger.info(f"Found default_tax_rate_profile in request data: {data['default_tax_rate_profile']}")
            # Make sure it's treated as an integer
            try:
                data['default_tax_rate_profile'] = int(data['default_tax_rate_profile'])
                logger.info(f"Converted default_tax_rate_profile to int: {data['default_tax_rate_profile']}")
            except (ValueError, TypeError):
                if data['default_tax_rate_profile'] == '' or data['default_tax_rate_profile'] is None:
                    data['default_tax_rate_profile'] = None
                    logger.info("Set empty default_tax_rate_profile to None")
        
        # Generate unique slug and SKU
        name = data.get('name', '')
        base_slug = data.get('slug') or slugify(name)
        base_sku = data.get('sku')
        
        # Ensure slug uniqueness
        from products.models import Product
        counter = 1
        slug = base_slug
        
        while Product.objects.filter(client_id=client_id, slug=slug).exists():
            counter += 1
            slug = f"{base_slug}-{counter}"
        
        # If SKU is provided, ensure its uniqueness
        if base_sku:
            sku = base_sku
            counter = 1
            while Product.objects.filter(client_id=client_id, sku=sku).exists():
                counter += 1
                sku = f"{base_sku}-{counter}"
            data['sku'] = sku
        
        # Set the unique values and client info
        data['slug'] = slug
        data['sku'] = sku
        data['client_id'] = client_id
        data['company_id'] = company_id
        
        # Find the next available ID
        last_product = Product.objects.all().order_by('id').last()
        next_id = 1 if not last_product else last_product.id + 1
        
        # Add the ID to the data
        data['id'] = next_id
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        
        try:
            
            # Get user information for audit fields
            user = self.request.user if hasattr(self.request, 'user') and self.request.user.is_authenticated else None
            if not user:
                # If no authenticated user, try to find a default admin user
                from django.contrib.auth import get_user_model
                User = get_user_model()
                user = User.objects.filter(is_superuser=True).first()
                if not user:
                    # If no admin user exists, create one
                    user = User.objects.create_superuser(
                        username='admin',
                        email='admin@example.com',
                        password='admin'
                    )
            
            # Get the validated data
            validated_data = serializer.validated_data
            
            # Create the product using Django ORM
            from products.models import Product
            import json
            
            # Prepare JSON fields
            tags = validated_data.get('tags', '')
            faqs = validated_data.get('faqs', [])
            
            # Get SEO fields (these can't be null in the database)
            name = validated_data.get('name', '')
            short_description = validated_data.get('short_description', '')
            seo_title = validated_data.get('seo_title', '') or request.data.get('seo_title', '') or name
            seo_description = validated_data.get('seo_description', '') or request.data.get('seo_description', '') or short_description
            seo_keywords = validated_data.get('seo_keywords', '') or request.data.get('seo_keywords', '')
            
            # Use raw SQL to insert the product and bypass Django ORM's foreign key constraints
            from django.db import connection
            import json
            from psycopg2.extras import Json
            
            # Get the category ID
            category_id = validated_data.get('category').id if validated_data.get('category') else None
           
            
            # Get IDs for related objects
            subcategory_id = validated_data.get('subcategory').id if validated_data.get('subcategory') else None
            division_id = validated_data.get('division').id if validated_data.get('division') else None
            uom_id = validated_data.get('uom').id if validated_data.get('uom') else None
            productstatus_id = validated_data.get('productstatus').id if validated_data.get('productstatus') else None
            currency_code_id = validated_data.get('currency_code').id if validated_data.get('currency_code', None) else None
            
            # Debug logging for default_tax_rate_profile
            logger.info(f"Raw default_tax_rate_profile from request: {request.data.get('default_tax_rate_profile')}")
            logger.info(f"validated_data keys: {validated_data.keys()}")
            logger.info(f"default_tax_rate_profile in validated_data: {validated_data.get('default_tax_rate_profile')}")
            
            default_tax_rate_profile_id = None
            if validated_data.get('default_tax_rate_profile'):
                default_tax_rate_profile_id = validated_data.get('default_tax_rate_profile').id
                logger.info(f"Setting default_tax_rate_profile_id to: {default_tax_rate_profile_id}")
            
            # Convert JSON fields
            tags_json = Json(tags) if tags else Json([])
            faqs_json = Json(faqs) if faqs else Json([])
            
            # Insert directly into the database using raw SQL
            with connection.cursor() as cursor:
                query = """
                INSERT INTO products_product (
                    created_at, updated_at, created_by_id, updated_by_id, 
                    client_id, company_id, product_type, publication_status,
                    name, slug, sku, description, short_description,
                    category_id, subcategory_id, division_id, uom_id,
                    productstatus_id, currency_code_id, default_tax_rate_profile_id,
                    is_tax_exempt, display_price, compare_at_price, is_active, allow_reviews,
                    inventory_tracking_enabled, backorders_allowed,
                    quantity_on_hand, is_serialized, is_lotted,
                    pre_order_available, pre_order_date, seo_title,
                    seo_description, seo_keywords, tags, faqs
                ) VALUES (
                    NOW(), NOW(), %s, %s, %s, %s, %s, %s,
                    %s, %s, %s, %s, %s, %s, %s, %s,
                    %s, %s, %s, %s, %s, %s, %s, %s,
                    %s, %s, %s, %s, %s, %s, %s, %s,
                    %s, %s, %s, %s, %s
                ) RETURNING id
                """
                
                cursor.execute(query, [
                    user.id, user.id,
                    client_id, company_id,
                    validated_data.get('product_type', 'REGULAR'),
                    validated_data.get('publication_status', 'DRAFT'),
                    name,
                    validated_data.get('slug', ''),
                    validated_data.get('sku', ''),
                    validated_data.get('description', ''),
                    short_description,
                    category_id,
                    subcategory_id,
                    division_id,
                    uom_id,
                    productstatus_id,
                    currency_code_id,
                    default_tax_rate_profile_id,  # Use the variable we prepared earlier
                    validated_data.get('is_tax_exempt', False),
                    validated_data.get('display_price', 0),
                    validated_data.get('compare_at_price', 0),
                    validated_data.get('is_active', True),
                    validated_data.get('allow_reviews', True),
                    validated_data.get('inventory_tracking_enabled', False),
                    validated_data.get('backorders_allowed', False),
                    validated_data.get('quantity_on_hand', 0),
                    validated_data.get('is_serialized', False),
                    validated_data.get('is_lotted', False),
                    validated_data.get('pre_order_available', False),
                    validated_data.get('pre_order_date'),
                    seo_title,
                    seo_description,
                    seo_keywords,
                    tags_json,
                    faqs_json
                ])
                
                # Get the ID of the newly created product
                product_id = cursor.fetchone()[0]
            
            # Fetch the created product
            product = Product.objects.get(id=product_id)
            
            # Handle attribute values if present in the request
            attribute_values_input = request.data.get('attribute_values_input', [])
            if attribute_values_input:
                from products.models import ProductAttributeValue, ProductAttributeMultiValue
                from attributes.models import Attribute, AttributeOption
                
                for attr_data in attribute_values_input:
                    attribute_id = attr_data.get('attribute')
                    attribute = Attribute.objects.get(id=attribute_id)
                    
                    # Create the base attribute value
                    attr_value = ProductAttributeValue.objects.create(
                        client_id=client_id,
                        company_id=company_id,
                        product=product,
                        attribute=attribute
                    )
                    
                    # Set the appropriate value field based on attribute type
                    if attribute.data_type == 'TEXT':
                        attr_value.value_text = attr_data.get('value')
                    elif attribute.data_type == 'NUMBER':
                        attr_value.value_number = attr_data.get('value')
                    elif attribute.data_type == 'BOOLEAN':
                        attr_value.value_boolean = attr_data.get('value')
                    elif attribute.data_type == 'DATE':
                        attr_value.value_date = attr_data.get('value')
                    elif attribute.data_type == 'SELECT':
                        option_id = attr_data.get('value')
                        if option_id:
                            attr_value.value_option = AttributeOption.objects.get(id=option_id)
                    elif attribute.data_type == 'MULTI_SELECT':
                        option_ids = attr_data.get('value', [])
                        attr_value.save()  # Save first to get an ID
                        # Create multi-value entries
                        for option_id in option_ids:
                            option = AttributeOption.objects.get(id=option_id)
                            ProductAttributeMultiValue.objects.create(
                                product_attribute_value=attr_value,
                                attribute_option=option
                            )
                    
                    attr_value.save()
            
            # Handle attribute_groups if present in the request
            attribute_groups = request.data.get('attribute_groups', [])
            if attribute_groups:
                from attributes.models import AttributeGroup
                # Add attribute groups to the product
                for group_id in attribute_groups:
                    try:
                        group = AttributeGroup.objects.get(id=group_id)
                        product.attribute_groups.add(group)
                    except AttributeGroup.DoesNotExist:
                        logger.warning(f"AttributeGroup with ID {group_id} does not exist")
            
            # Handle variant_defining_attributes if present in the request
            variant_defining_attributes = request.data.get('variant_defining_attributes', [])
            if variant_defining_attributes:
                from attributes.models import Attribute
                # Add variant defining attributes to the product
                for attr_id in variant_defining_attributes:
                    try:
                        attr = Attribute.objects.get(id=attr_id)
                        product.variant_defining_attributes.add(attr)
                    except Attribute.DoesNotExist:
                        logger.warning(f"Attribute with ID {attr_id} does not exist")
            
            # Handle temporary images if present in the request
            temp_images = request.data.get('temp_images', [])
            if temp_images:
                try:
                    # Use our mock Redis implementation
                    from products.mock_redis import mock_redis
                    
                    # Create a simple tenant-like object with an id attribute
                    class TenantLike:
                        def __init__(self, tenant_id, company_id=1):
                            self.id = tenant_id
                            self.company_id = company_id
                    
                    # Use the client_id that's already defined at the beginning of the method
                    tenant_obj = TenantLike(client_id)
                    
                    logger.info(f"Processing {len(temp_images)} temporary images for product {product.id}")
                    logger.info(f"Temp images data: {temp_images}")
                    
                    # Import here to avoid circular imports
                    from products.utils import link_temporary_images
                    
                    # Process temporary images and link them to the product
                    created_images = link_temporary_images(
                        owner_instance=product,
                        owner_type='product',
                        temp_image_data=temp_images,
                        tenant=tenant_obj,
                        redis_client=mock_redis
                    )
                    
                    logger.info(f"Successfully linked {len(created_images)} images to product {product.id}")
                except Exception as e:
                    logger.error(f"Failed to handle temporary images for product {product.id}: {str(e)}")
                    import traceback
                    logger.error(f"Traceback: {traceback.format_exc()}")
            
            # Return the serialized product
            serializer = self.get_serializer(product)
            
        except Exception as e:
            print(f"Error creating product: {str(e)}")
            raise
            
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class ProductVariantViewSet(TenantModelViewSet):
    """
    ViewSet for managing product variants.
    
    This viewset provides CRUD operations for the ProductVariant model,
    with automatic association to the parent product.
    """
    serializer_class = ProductVariantSerializer
    permission_classes = []
    
    def get_queryset(self):
        """
        Get the list of variants for this view, filtered by product and tenant.
        """
        product_id = self.kwargs.get('product_pk')
        
        # For development/testing, use client_id filtering instead of tenant
        client_id = getattr(self.request, 'tenant', None)
        
        if client_id is None:
            # Default to client_id=1 for development
            client_id = 1
            logger.info(f"No tenant found in request, using default client_id={client_id}")
        
        return ProductVariant.objects.filter(
            product_id=product_id,
            client_id=client_id
        ).select_related(
            'product'
        ).prefetch_related(
            'options',
            'images'
        )
    
    def perform_create(self, serializer):
        """
        Create a new product variant, automatically setting the product and tenant.
        """
        product_id = self.kwargs.get('product_pk')
        
        # For development/testing, use client_id filtering instead of tenant
        client_id = getattr(self.request, 'tenant', None)
        
        if client_id is None:
            # Default to client_id=1 for development
            client_id = 1
            logger.info(f"No tenant found in request, using default client_id={client_id}")
        
        product = Product.objects.get(id=product_id, client_id=client_id)
        
        if product.product_type != 'PARENT':
            raise ValidationError("Variants can only be created for PARENT type products.")
            
        serializer.save(
            product=product,
            client_id=client_id
        )
    
    def perform_update(self, serializer):
        """
        Update a product variant, ensuring the parent product is of PARENT type.
        """
        product = serializer.instance.product
        if product.product_type != 'PARENT':
            raise ValidationError("Variants can only be updated for PARENT type products.")
            
        serializer.save()


class ProductImageViewSet(TenantModelViewSet):
    """
    ViewSet for managing product images.
    
    This viewset provides CRUD operations for the ProductImage model,
    with automatic association to the parent product.
    """
    serializer_class = ProductImageSerializer
    permission_classes = []  # Authentication temporarily disabled
    parser_classes = [MultiPartParser, FormParser]
    
    def get_queryset(self):
        """
        Get the queryset for product images, filtered by product and client.
        """
        # Get the product ID from the URL
        product_pk = self.kwargs.get('product_pk')
        
        # For development/testing, use client_id filtering instead of tenant
        client_id = getattr(self.request, 'tenant', None)
        
        if client_id is None:
            # Default to client_id=1 for development
            client_id = 1
            logger.info(f"No tenant found in request, using default client_id={client_id}")
        
        # Filter by product and client
        return ProductImage.objects.filter(
            product_id=product_pk,
            client_id=client_id
        )
    
    def perform_create(self, serializer):
        """
        Create a new product image, automatically setting the product and client.
        """
        # Get the product ID from the URL
        product_pk = self.kwargs.get('product_pk')
        
        # For development/testing, use client_id filtering instead of tenant
        client_id = getattr(self.request, 'tenant', None)
        
        if client_id is None:
            # Default to client_id=1 for development
            client_id = 1
            logger.info(f"No tenant found in request, using default client_id={client_id}")
        
        # Get the product
        product = Product.objects.get(id=product_pk, client_id=client_id)
        
        # Save with the product and client
        serializer.save(
            product=product,
            client_id=client_id,
            company_id=getattr(client_id, 'company_id', 1) if hasattr(client_id, 'company_id') else 1
        )


class KitComponentViewSet(TenantModelViewSet):
    """
    ViewSet for managing kit components.
    
    This viewset provides CRUD operations for the KitComponent model,
    with automatic association to the parent kit product.
    """
    serializer_class = KitComponentSerializer
    permission_classes = []  # Authentication temporarily disabled
    
    def get_queryset(self):
        """
        Get the queryset for kit components, filtered by kit product and client.
        """
        # Get the product ID from the URL
        product_pk = self.kwargs.get('product_pk')
        
        # For development/testing, use client_id filtering instead of tenant
        client_id = getattr(self.request, 'tenant', None)
        
        if client_id is None:
            # Default to client_id=1 for development
            client_id = 1
            logger.info(f"No tenant found in request, using default client_id={client_id}")
        
        # Filter by kit product and client
        return KitComponent.objects.filter(
            kit_product_id=product_pk,
            client_id=client_id
        ).select_related('component_product', 'component_variant')
    
    def perform_create(self, serializer):
        """
        Create a new kit component, automatically setting the kit product and client.
        Also ensure the parent product is of KIT type.
        """
        # Get the product ID from the URL
        product_pk = self.kwargs.get('product_pk')
        
        # For development/testing, use client_id filtering instead of tenant
        client_id = getattr(self.request, 'tenant', None)
        
        if client_id is None:
            # Default to client_id=1 for development
            client_id = 1
            logger.info(f"No tenant found in request, using default client_id={client_id}")
        
        # Get the kit product
        kit_product = Product.objects.get(id=product_pk, client_id=client_id)
        
        # Ensure the product is of KIT type
        if kit_product.product_type != 'KIT':
            raise ValidationError("Components can only be added to KIT type products.")
        
        # Save with the kit product and client
        serializer.save(
            kit_product=kit_product,
            client_id=client_id,
            company_id=getattr(client_id, 'company_id', 1) if hasattr(client_id, 'company_id') else 1
        )
    
    def perform_update(self, serializer):
        """
        Update a kit component, ensuring the parent product is of KIT type.
        """
        # Get the product ID from the URL
        product_pk = self.kwargs.get('product_pk')
        
        # For development/testing, use client_id filtering instead of tenant
        client_id = getattr(self.request, 'tenant', None)
        
        if client_id is None:
            # Default to client_id=1 for development
            client_id = 1
            logger.info(f"No tenant found in request, using default client_id={client_id}")
        
        # Ensure the parent product is of KIT type
        try:
            kit_product = Product.objects.get(id=product_pk, client_id=client_id)
            if kit_product.product_type != 'KIT':
                raise ValidationError("Components can only be updated for products of KIT type.")
        except Product.DoesNotExist:
            raise ValidationError("Kit product does not exist.")
        
        # Save the kit component
        serializer.save(
            client_id=client_id,
            company_id=getattr(client_id, 'company_id', 1) if hasattr(client_id, 'company_id') else 1
        )


class GcsTestView(viewsets.ViewSet):
    def test_gcs(self, request):
        try:
            # Test writing a file
            test_content = 'This is a test file for GCS'
            test_path = 'catalogue-images/test/test_file.txt'
            
            # Write to GCS
            with default_storage.open(test_path, 'w') as f:
                f.write(test_content)
            
            # Test reading the file
            with default_storage.open(test_path, 'r') as f:
                content = f.read()
            
            # Clean up
            default_storage.delete(test_path)
            
            return Response({
                'status': 'success',
                'message': 'GCS configuration is working correctly!',
                'file_content': content
            })
            
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

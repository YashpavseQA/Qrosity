from rest_framework import viewsets, filters
# from rest_framework.permissions import IsAuthenticated  # Temporarily disabled
# Temporarily comment out django-filter import
# from django_filters.rest_framework import DjangoFilterBackend
from .models import Division, Category, Subcategory, UnitOfMeasure, ProductStatus
from .serializers import (
    DivisionSerializer, CategorySerializer, SubcategorySerializer,
    UnitOfMeasureSerializer, ProductStatusSerializer
)
from core.viewsets import TenantModelViewSet
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework import status

User = get_user_model()


class CORSMixin:
    """
    Mixin to add CORS headers to API responses.
    """
    def dispatch(self, request, *args, **kwargs):
        response = super().dispatch(request, *args, **kwargs)
        # Add CORS headers
        response["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, Authorization, accept, origin, referer, user-agent"
        response["Access-Control-Allow-Credentials"] = "true"
        return response
    
    def options(self, request, *args, **kwargs):
        """
        Handle OPTIONS requests for CORS preflight.
        """
        response = Response()
        response["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, Authorization, accept, origin, referer, user-agent"
        response["Access-Control-Allow-Credentials"] = "true"
        return response


class DivisionViewSet(CORSMixin, TenantModelViewSet):
    """
    API endpoint for managing Divisions.
    """
    queryset = Division.objects.all()
    serializer_class = DivisionSerializer
    # permission_classes = [IsAuthenticated]
    permission_classes = []  # Authentication temporarily disabled
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    # filterset_fields = ['is_active']  # Commented out as it requires django-filter
    search_fields = ['name', 'description']
    ordering_fields = ['id', 'name', 'created_at']
    ordering = ['id']
    
    
    def create(self, request, *args, **kwargs):
        """
        Create a new Division instance.
        Returns the new ID in the response after successful creation.
        """
        response = super().create(request, *args, **kwargs)
        
        # Add the new ID to the response data
        if response.status_code == 201:  # Created
            response.data['message'] = f"Division created successfully with ID: {response.data['id']}"
        
        return response
    
    def perform_create(self, serializer):
        """
        Override to avoid client-related functionality until multi-tenancy is fully implemented.
        Assign a default client_id for now to satisfy the database constraint.
        Also set created_by and updated_by fields.
        Check for the last ID in the records and increment it by 1 for new records.
        """
        # Get a default user for development purposes or use the authenticated user
        user = self.request.user if hasattr(self.request, 'user') and self.request.user.is_authenticated else None
        if not user:
            # If no authenticated user, use a default admin user
            user = User.objects.filter(is_superuser=True).first()
            if not user:
                # If no admin user exists, create one
                user = User.objects.create_superuser(
                    username='admin',
                    email='admin@example.com',
                    password='admin'
                )
        
        # Get the last ID in the records and increment it by 1
        last_division = Division.objects.order_by('-id').first()
        next_id = (last_division.id + 1) if last_division else 1
        
        serializer.save(
            client_id=1, 
            created_by=user, 
            updated_by=user, 
            id=next_id,
            company_id=1
        )
    
    def perform_update(self, serializer):
        """
        Set updated_by field when updating an object.
        """
        # Get a default user for development purposes or use the authenticated user
        user = self.request.user if hasattr(self.request, 'user') and self.request.user.is_authenticated else None
        if not user:
            # If no authenticated user, use a default admin user
            user = User.objects.filter(is_superuser=True).first()
            if not user:
                # If no admin user exists, create one
                user = User.objects.create_superuser(
                    username='admin',
                    email='admin@example.com',
                    password='admin'
                )
        
        serializer.save(updated_by=user, company_id=1)


class CategoryViewSet(CORSMixin, TenantModelViewSet):
    """
    API endpoint for managing Categories.
    """
    queryset = Category.objects.select_related('division').all()
    serializer_class = CategorySerializer
    # permission_classes = [IsAuthenticated]
    permission_classes = []  # Authentication temporarily disabled
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    # filterset_fields = ['is_active', 'division']  # Commented out as it requires django-filter
    search_fields = ['name', 'description']
    ordering_fields = ['id', 'name', 'division__name', 'sort_order', 'created_at']
    ordering = ['id']  # Default ordering by ID
    
    def perform_create(self, serializer):
        """
        Override to avoid client-related functionality until multi-tenancy is fully implemented.
        Assign a default client_id for now to satisfy the database constraint.
        Also set created_by and updated_by fields.
        Optionally set a specific ID for the new record.
        """
        # Get a default user for development purposes or use the authenticated user
        user = self.request.user if hasattr(self.request, 'user') and self.request.user.is_authenticated else None
        if not user:
            # If no authenticated user, use a default admin user
            user = User.objects.filter(is_superuser=True).first()
            if not user:
                # If no admin user exists, create one
                user = User.objects.create_superuser(
                    username='admin',
                    email='admin@example.com',
                    password='admin'
                )
        
        # Get the last ID in the records and increment it by 1, or use a specific starting ID
        last_category = Category.objects.order_by('-id').first()
        next_id = (last_category.id + 1) if last_category else 1
        
        serializer.save(client_id=1, created_by=user, updated_by=user, company_id=1, id=next_id)
    
    def perform_update(self, serializer):
        """
        Set updated_by field when updating an object.
        """
        # Get a default user for development purposes or use the authenticated user
        user = self.request.user if hasattr(self.request, 'user') and self.request.user.is_authenticated else None
        if not user:
            # If no authenticated user, use a default admin user
            user = User.objects.filter(is_superuser=True).first()
            if not user:
                # If no admin user exists, create one
                user = User.objects.create_superuser(
                    username='admin',
                    email='admin@example.com',
                    password='admin'
                )
        
        serializer.save(updated_by=user, company_id=1)


class SubcategoryViewSet(CORSMixin, TenantModelViewSet):
    """
    API endpoint for managing Subcategories.
    """
    queryset = Subcategory.objects.select_related('category', 'category__division').all()
    serializer_class = SubcategorySerializer
    # permission_classes = [IsAuthenticated]
    permission_classes = []  # Authentication temporarily disabled
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    # filterset_fields = ['is_active', 'category', 'category__division']  # Commented out as it requires django-filter
    search_fields = ['name', 'description']
    ordering_fields = ['id', 'name', 'category__name', 'sort_order', 'created_at']
    ordering = ['id']
    
    def perform_create(self, serializer):
        """
        Override to avoid client-related functionality until multi-tenancy is fully implemented.
        Assign a default client_id for now to satisfy the database constraint.
        Also set created_by and updated_by fields.
        Optionally set a specific ID for the new record.
        """
        # Get a default user for development purposes or use the authenticated user
        user = self.request.user if hasattr(self.request, 'user') and self.request.user.is_authenticated else None
        if not user:
            # If no authenticated user, use a default admin user
            user = User.objects.filter(is_superuser=True).first()
            if not user:
                # If no admin user exists, create one
                user = User.objects.create_superuser(
                    username='admin',
                    email='admin@example.com',
                    password='admin'
                )
        
        # Get the last ID in the records and increment it by 1, or use a specific starting ID
        last_subcategory = Subcategory.objects.order_by('-id').first()
        next_id = (last_subcategory.id + 1) if last_subcategory else 1
        
        serializer.save(client_id=1, created_by=user, updated_by=user, company_id=1, id=next_id)
    
    def perform_update(self, serializer):
        """
        Set updated_by field when updating an object.
        """
        # Get a default user for development purposes or use the authenticated user
        user = self.request.user if hasattr(self.request, 'user') and self.request.user.is_authenticated else None
        if not user:
            # If no authenticated user, use a default admin user
            user = User.objects.filter(is_superuser=True).first()
            if not user:
                # If no admin user exists, create one
                user = User.objects.create_superuser(
                    username='admin',
                    email='admin@example.com',
                    password='admin'
                )
        
        serializer.save(updated_by=user, company_id=1)


class UnitOfMeasureViewSet(CORSMixin, TenantModelViewSet):
    """
    API endpoint for managing Units of Measure.
    """
    queryset = UnitOfMeasure.objects.all().order_by('id')
    serializer_class = UnitOfMeasureSerializer
    # permission_classes = [IsAuthenticated]
    permission_classes = []  # Authentication temporarily disabled
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    # filterset_fields = ['is_active', 'type']  # Commented out as it requires django-filter
    search_fields = ['symbol', 'name']
    ordering_fields = ['id', 'name', 'symbol', 'created_at']
    ordering = ['id']
    
    def perform_create(self, serializer):
        """
        Override to avoid client-related functionality until multi-tenancy is fully implemented.
        Assign a default client_id for now to satisfy the database constraint.
        Also set created_by and updated_by fields.
        Optionally set a specific ID for the new record.
        """
        # Get a default user for development purposes or use the authenticated user
        user = self.request.user if hasattr(self.request, 'user') and self.request.user.is_authenticated else None
        if not user:
            # If no authenticated user, use a default admin user
            user = User.objects.filter(is_superuser=True).first()
            if not user:
                # If no admin user exists, create one
                user = User.objects.create_superuser(
                    username='admin',
                    email='admin@example.com',
                    password='admin'
                )
        
        # Get the last ID in the records and increment it by 1, or use a specific starting ID
        last_uom = UnitOfMeasure.objects.order_by('-id').first()
        next_id = (last_uom.id + 1) if last_uom else 1
        
        serializer.save(client_id=1, created_by=user, updated_by=user, company_id=1, id=next_id)
    
    def perform_update(self, serializer):
        """
        Set updated_by field when updating an object.
        """
        # Get a default user for development purposes or use the authenticated user
        user = self.request.user if hasattr(self.request, 'user') and self.request.user.is_authenticated else None
        if not user:
            # If no authenticated user, use a default admin user
            user = User.objects.filter(is_superuser=True).first()
            if not user:
                # If no admin user exists, create one
                user = User.objects.create_superuser(
                    username='admin',
                    email='admin@example.com',
                    password='admin'
                )
        
        serializer.save(updated_by=user, company_id=1)


class ProductStatusViewSet(CORSMixin, TenantModelViewSet):
    """
    API endpoint for managing Product Statuses.
    """
    queryset = ProductStatus.objects.all()
    serializer_class = ProductStatusSerializer
    # permission_classes = [IsAuthenticated]
    permission_classes = []  # Authentication temporarily disabled
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    # filterset_fields = ['is_orderable']  # Commented out as it requires django-filter
    search_fields = ['name']
    ordering_fields = ['id', 'name', 'created_at']
    ordering = ['id']
    
    def perform_create(self, serializer):
        """
        Override to avoid client-related functionality until multi-tenancy is fully implemented.
        Assign a default client_id for now to satisfy the database constraint.
        Also set created_by and updated_by fields.
        Optionally set a specific ID for the new record.
        """
        # Get a default user for development purposes or use the authenticated user
        user = self.request.user if hasattr(self.request, 'user') and self.request.user.is_authenticated else None
        if not user:
            # If no authenticated user, use a default admin user
            user = User.objects.filter(is_superuser=True).first()
            if not user:
                # If no admin user exists, create one
                user = User.objects.create_superuser(
                    username='admin',
                    email='admin@example.com',
                    password='admin'
                )
        
        # Get the last ID in the records and increment it by 1, or use a specific starting ID
        last_status = ProductStatus.objects.order_by('-id').first()
        next_id = (last_status.id + 1) if last_status else 1
        
        serializer.save(client_id=1, created_by=user, updated_by=user, company_id=1, id=next_id)
    
    def perform_update(self, serializer):
        """
        Set updated_by field when updating an object.
        """
        # Get a default user for development purposes or use the authenticated user
        user = self.request.user if hasattr(self.request, 'user') and self.request.user.is_authenticated else None
        if not user:
            # If no authenticated user, use a default admin user
            user = User.objects.filter(is_superuser=True).first()
            if not user:
                # If no admin user exists, create one
                user = User.objects.create_superuser(
                    username='admin',
                    email='admin@example.com',
                    password='admin'
                )
        
        serializer.save(updated_by=user, company_id=1)

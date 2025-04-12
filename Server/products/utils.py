"""
Utility functions for the products app.

This module provides helper functions for product-related operations,
such as SKU generation, validation, and data transformation.
"""

import uuid
import re
import os
import json
import shutil
from django.utils.text import slugify
from django.db import transaction
from rest_framework import serializers
import redis
from django.conf import settings
import logging
from contextlib import contextmanager
from django.core.files import File
from django.core.files.storage import default_storage

from products.models import Product, ProductVariant, ProductImage
from products.placeholder_images import get_placeholder_for_product

logger = logging.getLogger(__name__)

def generate_unique_sku(tenant, product_data=None):
    """
    Generate a unique SKU for a product based on tenant settings.
    
    Args:
        tenant: The tenant object for which the SKU is being generated.
        product_data (dict, optional): Dictionary containing product data like name, category, etc.
            This can be used for generating SKUs based on product attributes.
            
    Returns:
        str: A unique SKU string that doesn't exist for the tenant.
    """
    # Default SKU format if tenant settings don't specify one
    sku_prefix = "PRD"
    sku_format = "{prefix}-{uuid}"
    
    # Try to get SKU settings from tenant settings
    try:
        tenant_settings = tenant.settings.get(key='product_sku_settings', default={})
        sku_prefix = tenant_settings.get('sku_prefix', sku_prefix)
        sku_format = tenant_settings.get('sku_format', sku_format)
    except (AttributeError, Exception):
        # If tenant.settings is not available or any other error occurs, use defaults
        pass
    
    # Generate a base SKU using the format
    base_sku = sku_format
    
    # Replace placeholders in the format
    if '{prefix}' in base_sku:
        base_sku = base_sku.replace('{prefix}', sku_prefix)
    
    if '{product_id}' in base_sku and product_data and 'id' in product_data:
        base_sku = base_sku.replace('{product_id}', str(product_data['id']))
    
    if '{category}' in base_sku and product_data and 'category' in product_data:
        from products.models import ProductCategory
        try:
            category = ProductCategory.objects.get(pk=product_data['category'])
            category_code = slugify(category.category_name)[:3].upper()
            base_sku = base_sku.replace('{category}', category_code)
        except ProductCategory.DoesNotExist:
            base_sku = base_sku.replace('{category}', 'CAT')
    
    if '{name}' in base_sku and product_data and 'name' in product_data:
        name_code = slugify(product_data['name'])[:5].upper()
        base_sku = base_sku.replace('{name}', name_code)
    
    # Replace {uuid} with a short UUID (first 8 chars)
    if '{uuid}' in base_sku:
        short_uuid = str(uuid.uuid4())[:8]
        base_sku = base_sku.replace('{uuid}', short_uuid)
    
    # Check if the generated SKU already exists
    counter = 1
    generated_sku = base_sku
    
    # Keep checking and modifying until we find a unique SKU
    while (Product.objects.filter(client_id=tenant.id, sku=generated_sku).exists() or 
           ProductVariant.objects.filter(client_id=tenant.id, sku=generated_sku).exists()):
        # If the SKU already has a counter suffix, increment it
        if re.search(r'-\d+$', generated_sku):
            generated_sku = re.sub(r'-\d+$', f'-{counter}', generated_sku)
        else:
            # Otherwise, append the counter
            generated_sku = f"{base_sku}-{counter}"
        counter += 1
    
    return generated_sku


@contextmanager
def cleanup_context(temp_file_path: str, redis_client, redis_key: str):
    """Context manager to ensure cleanup of temporary files and Redis keys."""
    try:
        yield
    finally:
        try:
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)
                logger.debug(f"Cleaned up temporary file: {temp_file_path}")
        except OSError as e:
            logger.warning(f"Failed to remove temporary file {temp_file_path}: {e}")
        
        try:
            redis_client.delete(redis_key)
            logger.debug(f"Cleaned up Redis key: {redis_key}")
        except Exception as e:
            logger.warning(f"Failed to delete Redis key {redis_key}: {e}")


def link_temporary_images(*, owner_instance, owner_type: str, temp_image_data: list, tenant, redis_client=None):
    """
    Link temporary images to a product or variant.
    
    This function creates ProductImage instances linked to the specified owner (product or variant).
    In development mode, it creates records without actual image files.
    In production, it would process temporary image files and upload them to storage.
    
    Args:
        owner_instance: The product or variant instance to link images to
        owner_type: Either 'product' or 'variant'
        temp_image_data: List of dictionaries with temp image metadata
            Format: [{'id': temp_id, 'alt_text': '...', 'sort_order': 0, 'is_default': False}, ...]
        tenant: The tenant object
        redis_client: Optional Redis client instance (for testing)
        
    Returns:
        list: List of created ProductImage instances
    
    Raises:
        ValidationError: If validation fails
    """
    created_images = []
    
    # Debug logging
    logger.info(f"Starting link_temporary_images with {len(temp_image_data)} images")
    logger.info(f"Tenant: {tenant}, Tenant ID: {tenant.id if hasattr(tenant, 'id') else 'No ID'}")
    logger.info(f"Owner instance: {owner_instance}, Owner type: {owner_type}")
    
    if owner_type not in ('product', 'variant'):
        raise serializers.ValidationError("owner_type must be either 'product' or 'variant'")
    
    for img_data in temp_image_data:
        temp_id = img_data['id']
        logger.info(f"Processing image with ID: {temp_id}")
        
        try:
            # Create ProductImage instance with the correct structure
            logger.info(f"Creating ProductImage with client_id={tenant.id}, owner_type={owner_type}")
            
            # Create the image instance with common fields
            image_instance = ProductImage(
                client_id=tenant.id,
                company_id=getattr(tenant, 'company_id', 1),
                alt_text=img_data.get('alt_text', ''),
                sort_order=img_data.get('sort_order', 0),
                is_default=img_data.get('is_default', False)
            )
            
            # Set the appropriate relationship based on owner_type
            if owner_type == 'product':
                image_instance.product = owner_instance
                image_instance.variant = None
                logger.info(f"Linking image to product ID: {owner_instance.id}")
            elif owner_type == 'variant':
                image_instance.variant = owner_instance
                image_instance.product = None
                logger.info(f"Linking image to variant ID: {owner_instance.id}")
            else:
                # This should never happen due to the validation above
                logger.error(f"Invalid owner_type '{owner_type}' passed to link_temporary_images")
                raise serializers.ValidationError(f"Invalid owner_type: {owner_type}")
            
            # Log the state before saving
            logger.info(f"Image state before save: product_id={getattr(image_instance.product, 'id', None)}, variant_id={getattr(image_instance.variant, 'id', None)}")
            
            # Save the image instance
            image_instance.save()
            logger.info(f"Successfully saved ProductImage with ID: {image_instance.id}")
            
            created_images.append(image_instance)
            
        except Exception as e:
            logger.error(f"Failed to process temporary image {temp_id}: {str(e)}")
            logger.exception("Exception details:")
            continue
    
    logger.info(f"Completed link_temporary_images, created {len(created_images)} images")
    return created_images

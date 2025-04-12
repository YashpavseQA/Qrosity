"""
Filters for the products app.

This module provides filter classes for filtering querysets in the products app,
using django-filter.
"""

import django_filters
from products.models import PRODUCT_TYPE_CHOICES, Product, PublicationStatus


class ProductFilter(django_filters.FilterSet):
    """
    Filter for Product model.
    
    Allows filtering products by various fields including product_type,
    category, publication_status, and is_active.
    """
    name = django_filters.CharFilter(lookup_expr='icontains')
    sku = django_filters.CharFilter(lookup_expr='icontains')
    description = django_filters.CharFilter(lookup_expr='icontains')
    product_type = django_filters.ChoiceFilter(choices=PRODUCT_TYPE_CHOICES.CHOICES)
    min_price = django_filters.NumberFilter(field_name='display_price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='display_price', lookup_expr='lte')
    publication_status = django_filters.ChoiceFilter(choices=PublicationStatus.choices)
    
    class Meta:
        model = Product
        fields = {
            'category': ['exact'],
            'is_active': ['exact'],
            'inventory_tracking_enabled': ['exact'],
            'backorders_allowed': ['exact'],
            'is_tax_exempt': ['exact'],
            'allow_reviews': ['exact'],
        }

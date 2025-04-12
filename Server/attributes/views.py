"""
Views for the attributes app.

This module defines ViewSets for attribute-related models such as AttributeGroup,
Attribute, and AttributeOption.
"""
from rest_framework import filters, viewsets
from django.contrib.auth import get_user_model
from django.db import connection
from core.viewsets import TenantModelViewSet
from .models import AttributeGroup, Attribute, AttributeOption
from .serializers import (
    AttributeGroupSerializer, AttributeSerializer, AttributeOptionSerializer
)

User = get_user_model()


class AttributeGroupViewSet(TenantModelViewSet):
    """API endpoint for managing attribute groups."""
    queryset = AttributeGroup.objects.all()
    serializer_class = AttributeGroupSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name', 'display_order', 'created_at']
    ordering = ['display_order', 'name']
    
    def perform_create(self, serializer):
        """
        Create a new attribute group with client_id, company_id, created_by and updated_by.
        
        Sets client_id and company_id to 1, and assigns the first user as created_by and updated_by.
        Also sets is_active to True by default.
        """
        # Get a default user for created_by and updated_by
        default_user = User.objects.first()
        
        serializer.save(
            client_id=1,
            company_id=1,
            created_by=default_user,
            updated_by=default_user,
            is_active=True
        )
    
    def perform_update(self, serializer):
        """
        Update an attribute group with client_id, company_id and updated_by.
        
        Sets client_id and company_id to 1, and assigns the first user as updated_by.
        """
        # Get a default user for updated_by
        default_user = User.objects.first()
        
        serializer.save(
            client_id=1,
            company_id=1,
            updated_by=default_user
        )


class AttributeViewSet(TenantModelViewSet):
    """
    API endpoint for managing attributes.
    
    This viewset handles the CRUD operations for attributes, including the
    management of nested attribute options through the options_input field.
    """
    queryset = Attribute.objects.prefetch_related('groups', 'options').all().order_by('id')
    serializer_class = AttributeSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'code', 'label', 'description']
    ordering_fields = ['name', 'label', 'created_at']
    ordering = ['name']
    
    def get_queryset(self):
        """
        Get the list of attributes for the current client with optimized prefetching.
        """
        queryset = super().get_queryset()
        
        # Add additional filters if needed
        data_type = self.request.query_params.get('data_type')
        if data_type:
            queryset = queryset.filter(data_type=data_type)
            
        use_for_variants = self.request.query_params.get('use_for_variants')
        if use_for_variants is not None:
            use_for_variants = use_for_variants.lower() == 'true'
            queryset = queryset.filter(use_for_variants=use_for_variants)
            
        show_on_pdp = self.request.query_params.get('show_on_pdp')
        if show_on_pdp is not None:
            show_on_pdp = show_on_pdp.lower() == 'true'
            queryset = queryset.filter(show_on_pdp=show_on_pdp)
            
        # Filter by attribute group if specified
        group_id = self.request.query_params.get('group')
        if group_id:
            queryset = queryset.filter(groups__id=group_id)
            
        return queryset
    
    def perform_create(self, serializer):
        """
        Create a new attribute with client_id, company_id, created_by and updated_by.
        
        Sets client_id and company_id to 1, and assigns the first user as created_by and updated_by.
        Also sets is_active to True by default.
        
        If the table is empty, resets the ID sequence to start from 1.
        """
        # Check if the table is empty and reset the sequence if needed
        if not Attribute.objects.exists():
            with connection.cursor() as cursor:
                table_name = Attribute._meta.db_table
                if connection.vendor == 'postgresql':
                    cursor.execute(f"ALTER SEQUENCE {table_name}_id_seq RESTART WITH 1")
                elif connection.vendor == 'sqlite':
                    cursor.execute(f"UPDATE sqlite_sequence SET seq = 0 WHERE name = '{table_name}'")
                elif connection.vendor == 'mysql':
                    cursor.execute(f"ALTER TABLE {table_name} AUTO_INCREMENT = 1")
        
        # Get a default user for created_by and updated_by
        default_user = User.objects.first()
        
        serializer.save(
            client_id=1,
            company_id=1,
            created_by=default_user,
            updated_by=default_user,
            is_active=True
        )
    
    def perform_update(self, serializer):
        """
        Update an attribute with client_id, company_id and updated_by.
        
        Sets client_id and company_id to 1, and assigns the first user as updated_by.
        """
        # Get a default user for updated_by
        default_user = User.objects.first()
        
        serializer.save(
            client_id=1,
            company_id=1,
            updated_by=default_user
        )


class AttributeOptionViewSet(TenantModelViewSet):
    """
    API endpoint for managing attribute options.
    
    This viewset handles the CRUD operations for attribute options.
    """
    queryset = AttributeOption.objects.select_related('attribute').all()
    serializer_class = AttributeOptionSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['option_label', 'option_value', 'attribute__label']
    ordering_fields = ['attribute__label', 'sort_order', 'option_label', 'created_at']
    ordering = ['attribute__label', 'sort_order', 'option_label']
    
    def get_queryset(self):
        """
        Get the list of attribute options for the current client with filtering by attribute.
        """
        queryset = super().get_queryset()
        
        # Filter by attribute if specified
        attribute_id = self.request.query_params.get('attribute')
        if attribute_id:
            queryset = queryset.filter(attribute_id=attribute_id)
            
        return queryset
    
    def perform_create(self, serializer):
        """
        Create a new attribute option with client_id, company_id, created_by and updated_by.
        
        Sets client_id and company_id to 1, and assigns the first user as created_by and updated_by.
        """
        # Get a default user for created_by and updated_by
        default_user = User.objects.first()
        
        serializer.save(
            client_id=1,
            company_id=1,
            created_by=default_user,
            updated_by=default_user
        )
    
    def perform_update(self, serializer):
        """
        Update an attribute option with client_id, company_id and updated_by.
        
        Sets client_id and company_id to 1, and assigns the first user as updated_by.
        """
        # Get a default user for updated_by
        default_user = User.objects.first()
        
        serializer.save(
            client_id=1,
            company_id=1,
            updated_by=default_user
        )

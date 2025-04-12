"""
Views for the pricing app.

This module defines ViewSets for pricing-related models such as CustomerGroup,
SellingChannel, TaxRegion, TaxRate, and TaxRateProfile.
"""
from rest_framework.permissions import IsAuthenticated
from core.viewsets import TenantModelViewSet
from .models import CustomerGroup, SellingChannel, TaxRegion, TaxRate, TaxRateProfile
from .serializers import (
    CustomerGroupSerializer, SellingChannelSerializer, TaxRegionSerializer,
    TaxRateSerializer, TaxRateProfileSerializer
)
from django.contrib.auth.models import User


class CustomerGroupViewSet(TenantModelViewSet):
    """
    ViewSet for managing customer groups.
    
    Provides CRUD operations for customer groups.
    """
    serializer_class = CustomerGroupSerializer
    queryset = CustomerGroup.objects.all()
    
    def get_queryset(self):
        """
        Override to ensure customer groups are ordered by ID in ascending order.
        """
        queryset = super().get_queryset()
        return queryset.order_by('id')


class SellingChannelViewSet(TenantModelViewSet):
    """
    ViewSet for managing selling channels.
    
    Provides CRUD operations for selling channels.
    """
    serializer_class = SellingChannelSerializer
    queryset = SellingChannel.objects.all().order_by('id')


class TaxRegionViewSet(TenantModelViewSet):
    """
    ViewSet for managing tax regions.
    
    Provides CRUD operations for tax regions.
    """
    serializer_class = TaxRegionSerializer
    queryset = TaxRegion.objects.all().order_by('id')


class TaxRateViewSet(TenantModelViewSet):
    """
    ViewSet for managing tax rates.
    
    Provides CRUD operations for tax rates.
    """
    serializer_class = TaxRateSerializer
    queryset = TaxRate.objects.all().order_by('id')
    
    def perform_create(self, serializer):
        """
        Override to ensure new tax rates are always created with is_active=True.
        Also finds the lowest available ID to reuse deleted IDs.
        """
        # Get a default user for created_by and updated_by
        default_user = User.objects.first()
        
        # Find the lowest available ID
        all_ids = set(TaxRate.objects.values_list('id', flat=True))
        next_id = 1
        while next_id in all_ids:
            next_id += 1
        
        # Try to find a gap in the IDs (deleted records)
        for i in range(1, next_id):
            if i not in all_ids:
                next_id = i
                break
        
        # Save with is_active=True and other required fields
        serializer.save(
            id=next_id,  # Set the ID explicitly
            client_id=1,
            created_by=default_user,
            updated_by=default_user,
            is_active=True  # Always set is_active to True for new tax rates
        )


class TaxRateProfileViewSet(TenantModelViewSet):
    """
    ViewSet for managing tax rate profiles.
    
    Provides CRUD operations for tax rate profiles.
    """
    serializer_class = TaxRateProfileSerializer
    queryset = TaxRateProfile.objects.all().order_by('id')
    
    def perform_create(self, serializer):
        """
        Override to ensure new tax rate profiles reuse deleted IDs.
        Finds the lowest available ID to reuse deleted IDs.
        """
        # Get a default user for created_by and updated_by
        default_user = User.objects.first()
        
        # Find the lowest available ID
        all_ids = set(TaxRateProfile.objects.values_list('id', flat=True))
        next_id = 1
        while next_id in all_ids:
            next_id += 1
        
        # Try to find a gap in the IDs (deleted records)
        for i in range(1, next_id):
            if i not in all_ids:
                next_id = i
                break
        
        # Save with the found ID and other required fields
        serializer.save(
            id=next_id,  # Set the ID explicitly
            client_id=1,
            created_by=default_user,
            updated_by=default_user
        )

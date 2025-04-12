"""
API views for shared models.

These views provide API endpoints for accessing shared models.
"""
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .models import Country, Currency
from .serializers import CountrySerializer, CurrencySerializer


class CountryViewSet(viewsets.ModelViewSet):
    """
    API endpoint for Countries.
    
    Provides CRUD operations for Country model instances.
    """
    queryset = Country.objects.all().order_by('id')
    serializer_class = CountrySerializer
    # permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'iso_code'


class CurrencyViewSet(viewsets.ModelViewSet):
    """
    API endpoint for currencies.
    
    Provides CRUD operations for Currency model.
    """
    queryset = Currency.objects.all().order_by('id')
    serializer_class = CurrencySerializer
    # permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'code'
    
    def create(self, request, *args, **kwargs):
        """
        Override create method to set default values for client_id, created_by_id, and updated_by_id.
        """
        # Get or set default user (admin)
        default_user_id = 1
        default_user = User.objects.filter(id=default_user_id).first()
        
        # Add default values to request data
        data = request.data.copy()
        data['client'] = 1  # Default client_id
        data['company_id'] = 1  # Default company_id
        
        # Create serializer with modified data
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        
        # Save with default user
        instance = serializer.save(
            created_by=default_user,
            updated_by=default_user
        )
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def update(self, request, *args, **kwargs):
        """
        Override update method to set default values for updated_by_id.
        """
        # Get or set default user (admin)
        default_user_id = 1
        default_user = User.objects.filter(id=default_user_id).first()
        
        # Get instance and update it
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=kwargs.get('partial', False))
        serializer.is_valid(raise_exception=True)
        
        # Save with default user as updated_by
        serializer.save(updated_by=default_user)
        
        return Response(serializer.data)

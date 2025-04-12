"""
Serializers for the pricing app.

This module defines serializers for pricing-related models such as CustomerGroup,
SellingChannel, TaxRegion, TaxRate, and TaxRateProfile.
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import CustomerGroup, SellingChannel, TaxRegion, TaxRate, TaxRateProfile
from shared.models import Country

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for the User model."""
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = fields


class CountrySerializer(serializers.ModelSerializer):
    """Serializer for the Country model."""
    
    class Meta:
        model = Country
        fields = ['id', 'name', 'iso_code']
        read_only_fields = fields


class CustomerGroupSerializer(serializers.ModelSerializer):
    """Serializer for the CustomerGroup model."""
    
    company_id = serializers.IntegerField(read_only=True, default=1)
    client_id = serializers.IntegerField(source='client.id', read_only=True)
    created_by_id = serializers.IntegerField(source='created_by.id', read_only=True)
    updated_by_id = serializers.IntegerField(source='updated_by.id', read_only=True)
    created_by = UserSerializer(read_only=True)
    updated_by = UserSerializer(read_only=True)
    is_active = serializers.BooleanField(default=True)
    
    class Meta:
        model = CustomerGroup
        fields = [
            'id', 'name', 'code', 'description', 'is_active', 'company_id', 'client_id', 
            'created_by', 'updated_by', 'created_by_id', 'updated_by_id',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'company_id', 'client_id',
            'created_by', 'updated_by', 'created_by_id', 'updated_by_id'
        ]
    
    def validate(self, data):
        """
        Validate that the customer group name is unique for the client.
        """
        name = data.get('name')
        instance = self.instance
        
        # For now, we're using client_id=1 for all operations
        # This will be replaced with proper client handling later
        if CustomerGroup.objects.filter(client_id=1, name=name).exclude(id=instance.id if instance else None).exists():
            raise serializers.ValidationError({'name': 'A customer group with this name already exists.'})
        
        return data


class SellingChannelSerializer(serializers.ModelSerializer):
    """Serializer for the SellingChannel model."""
    
    company_id = serializers.IntegerField(read_only=True, default=1)
    client_id = serializers.IntegerField(source='client.id', read_only=True)
    created_by_id = serializers.IntegerField(source='created_by.id', read_only=True)
    updated_by_id = serializers.IntegerField(source='updated_by.id', read_only=True)
    created_by = UserSerializer(read_only=True)
    updated_by = UserSerializer(read_only=True)
    is_active = serializers.BooleanField(default=True)
    
    class Meta:
        model = SellingChannel
        fields = [
            'id', 'name', 'code', 'description', 'is_active', 'company_id', 'client_id',
            'created_by', 'updated_by', 'created_by_id', 'updated_by_id',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'company_id', 'client_id',
            'created_by', 'updated_by', 'created_by_id', 'updated_by_id'
        ]
    
    def validate(self, data):
        """
        Validate that the selling channel name is unique for the client.
        """
        name = data.get('name')
        instance = self.instance
        
        # For now, we're using client_id=1 for all operations
        # This will be replaced with proper client handling later
        if SellingChannel.objects.filter(client_id=1, name=name).exclude(id=instance.id if instance else None).exists():
            raise serializers.ValidationError({'name': 'A selling channel with this name already exists.'})
        
        return data


class TaxRegionSerializer(serializers.ModelSerializer):
    """Serializer for the TaxRegion model."""
    
    company_id = serializers.IntegerField(read_only=True, default=1)
    client_id = serializers.IntegerField(source='client.id', read_only=True)
    created_by_id = serializers.IntegerField(source='created_by.id', read_only=True)
    updated_by_id = serializers.IntegerField(source='updated_by.id', read_only=True)
    created_by = UserSerializer(read_only=True)
    updated_by = UserSerializer(read_only=True)
    # Add a nested serializer for detailed country information
    country_details = CountrySerializer(source='countries', many=True, read_only=True)
    
    # Keep the original field for write operations
    countries = serializers.PrimaryKeyRelatedField(
        queryset=Country.objects.all(),
        many=True,
        required=False
    )
    
    # Set is_active with default=True, but allow it to be changed
    is_active = serializers.BooleanField(default=True)
    
    # Add description field
    description = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    
    class Meta:
        model = TaxRegion
        fields = [
            'id', 'name', 'code', 'description', 'countries', 'country_details', 'is_active', 'company_id', 'client_id',
            'created_by', 'updated_by', 'created_by_id', 'updated_by_id',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'company_id', 'client_id',
            'created_by', 'updated_by', 'created_by_id', 'updated_by_id',
            'country_details'
        ]
    
    def validate(self, data):
        """
        Validate that the tax region name is unique for the client.
        """
        name = data.get('name')
        instance = self.instance
        
        # For now, we're using client_id=1 for all operations
        # This will be replaced with proper client handling later
        if TaxRegion.objects.filter(client_id=1, name=name).exclude(id=instance.id if instance else None).exists():
            raise serializers.ValidationError({'name': 'A tax region with this name already exists.'})
        
        return data
    
    def create(self, validated_data):
        """
        Create and return a new TaxRegion instance, with countries set.
        """
        # Always set is_active to True for new instances, regardless of what was provided
        validated_data['is_active'] = True
            
        countries = validated_data.pop('countries', [])
        tax_region = TaxRegion.objects.create(**validated_data)
        
        # Explicitly set the countries
        if countries:
            tax_region.countries.set(countries)
        
        return tax_region
    
    def update(self, instance, validated_data):
        """
        Update and return an existing TaxRegion instance, with countries set.
        """
        countries = validated_data.pop('countries', None)
        
        # Update the instance fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Explicitly set the countries if provided
        if countries is not None:
            instance.countries.set(countries)
        
        return instance
    
    def to_representation(self, instance):
        """
        Sort the results by ID.
        """
        representation = super().to_representation(instance)
        representation['countries'] = sorted(representation['countries'])
        return representation


class TaxRateSerializer(serializers.ModelSerializer):
    """Serializer for the TaxRate model."""
    
    company_id = serializers.IntegerField(read_only=True, default=1)
    client_id = serializers.IntegerField(source='client.id', read_only=True)
    created_by_id = serializers.IntegerField(source='created_by.id', read_only=True)
    updated_by_id = serializers.IntegerField(source='updated_by.id', read_only=True)
    created_by = UserSerializer(read_only=True)
    updated_by = UserSerializer(read_only=True)
    # Only use tax_regions field for multiple tax regions
    tax_regions = serializers.PrimaryKeyRelatedField(
        queryset=TaxRegion.objects.filter(client_id=1),
        many=True,
        required=True
    )
    # Add nested serializers for detailed information
    tax_regions_details = TaxRegionSerializer(source='tax_regions', many=True, read_only=True)
    category = serializers.SerializerMethodField(read_only=True)
    is_active = serializers.BooleanField(default=True)
    description = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    
    class Meta:
        model = TaxRate
        fields = [
            'id', 'tax_regions', 'tax_regions_details', 'category_id', 'category', 'tax_type', 'tax_code', 'tax_percentage',
            'price_from', 'price_to', 'description', 'is_active', 'company_id', 'client_id',
            'created_by', 'updated_by', 'created_by_id', 'updated_by_id',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'company_id', 'client_id',
            'created_by', 'updated_by', 'created_by_id', 'updated_by_id',
            'tax_regions_details', 'category'
        ]
    
    def get_category(self, obj):
        """
        Get category details if category_id is provided.
        """
        from products.catalogue.models import Category
        from products.catalogue.serializers import CategorySerializer
        
        if obj.category_id:
            try:
                category = Category.objects.get(id=obj.category_id)
                return CategorySerializer(category).data
            except Category.DoesNotExist:
                return None
        return None
    
    def validate(self, data):
        """
        Validate that the tax rate is valid.
        """
        # Ensure that price_from is less than price_to
        price_from = data.get('price_from')
        price_to = data.get('price_to')
        
        if price_from is not None and price_to is not None and price_from >= price_to:
            raise serializers.ValidationError({'price_from': 'Price from must be less than price to.'})
        
        return data


class SimpleTaxRateSerializer(serializers.ModelSerializer):
    """Simplified serializer for TaxRate with only essential fields."""
    
    class Meta:
        model = TaxRate
        fields = ['id', 'tax_type', 'tax_code', 'tax_percentage']


class TaxRateProfileSerializer(serializers.ModelSerializer):
    """Serializer for the TaxRateProfile model."""
    
    company_id = serializers.IntegerField(read_only=True, default=1)
    client_id = serializers.IntegerField(source='client.id', read_only=True)
    created_by_id = serializers.IntegerField(source='created_by.id', read_only=True)
    updated_by_id = serializers.IntegerField(source='updated_by.id', read_only=True)
    created_by = UserSerializer(read_only=True)
    updated_by = UserSerializer(read_only=True)
    tax_rates = serializers.PrimaryKeyRelatedField(
        queryset=TaxRate.objects.filter(client_id=1),
        many=True,
        required=False
    )
    tax_rates_details = SimpleTaxRateSerializer(source='tax_rates', many=True, read_only=True)
    is_active = serializers.BooleanField(default=True)
    is_default = serializers.BooleanField(default=False)
    code = serializers.CharField(allow_blank=True, required=False)
    description = serializers.CharField(allow_blank=True, required=False)
    
    class Meta:
        model = TaxRateProfile
        fields = [
            'id', 'name', 'code', 'description', 'is_active', 'is_default', 
            'tax_rates', 'tax_rates_details', 'company_id', 'client_id',
            'created_by', 'updated_by', 'created_by_id', 'updated_by_id',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'company_id', 'client_id',
            'created_by', 'updated_by', 'created_by_id', 'updated_by_id',
            'tax_rates_details'
        ]
    
    def validate(self, data):
        """
        Validate that the tax rate profile is valid.
        """
        name = data.get('name')
        instance = self.instance
        
        # For now, we're using client_id=1 for all operations
        # This will be replaced with proper client handling later
        if TaxRateProfile.objects.filter(client_id=1, name=name).exclude(id=instance.id if instance else None).exists():
            raise serializers.ValidationError({'name': 'A tax rate profile with this name already exists.'})
        
        return data
    
    def validate_tax_rates(self, tax_rates):
        """
        Validate that all tax rates belong to the same client.
        """
        # For now, we're using client_id=1 for all operations
        # This will be replaced with proper client handling later
        for tax_rate in tax_rates:
            if tax_rate.client_id != 1:
                raise serializers.ValidationError('All tax rates must belong to the same client.')
        
        return tax_rates

"""
Models for the pricing app.

This module defines models for pricing-related entities such as customer groups,
selling channels, tax regions, tax rates, and tax rate profiles.
"""
from django.db import models
from django.conf import settings
from core.models.base import TimestampedModel


class CustomerGroup(TimestampedModel):
    """
    Customer group model for grouping customers for pricing purposes.
    
    Customer groups can be used to define different pricing tiers for different
    groups of customers.
    """
    client = models.ForeignKey(
        settings.TENANT_MODEL, 
        on_delete=models.CASCADE, 
        related_name='customer_groups'
    )
    company_id = models.IntegerField(default=1)
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, blank=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_customer_groups'
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='updated_customer_groups'
    )
    
    class Meta:
        unique_together = ('client', 'name')
        ordering = ['name']
    
    def __str__(self):
        return self.name


class SellingChannel(TimestampedModel):
    """
    Selling channel model for defining different sales channels.
    
    Selling channels represent different platforms or methods through which
    products are sold, such as website, mobile app, physical store, etc.
    """
    client = models.ForeignKey(
        settings.TENANT_MODEL, 
        on_delete=models.CASCADE, 
        related_name='selling_channels'
    )
    company_id = models.IntegerField(default=1)
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, blank=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_selling_channels'
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='updated_selling_channels'
    )
    
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['client', 'code'], 
                condition=~models.Q(code=''), 
                name='unique_client_code_if_present'
            )
        ]
        unique_together = ('client', 'name')
        ordering = ['id']
    
    def __str__(self):
        return self.name


class TaxRegion(TimestampedModel):
    """
    Tax region model for defining geographical regions for tax purposes.
    
    Tax regions can be used to define different tax rates for different
    geographical areas.
    """
    client = models.ForeignKey(
        settings.TENANT_MODEL, 
        on_delete=models.CASCADE, 
        related_name='tax_regions'
    )
    company_id = models.IntegerField(default=1)
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=50, blank=True)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    countries = models.ManyToManyField(
        'shared.Country', 
        blank=True, 
        related_name='tax_regions'
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_tax_regions'
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='updated_tax_regions'
    )
    
    class Meta:
        unique_together = ('client', 'name')
        ordering = ['name']
    
    def __str__(self):
        return self.name


class TaxRate(TimestampedModel):
    """
    Tax rate model for defining tax rates for different regions and categories.
    
    Tax rates can be defined for specific regions and optionally for specific
    product categories within those regions.
    """
    client = models.ForeignKey(
        settings.TENANT_MODEL, 
        on_delete=models.CASCADE, 
        related_name='tax_rates'
    )
    company_id = models.IntegerField(default=1)
    # Only use ManyToManyField for tax regions
    tax_regions = models.ManyToManyField(
        TaxRegion, 
        related_name='rates'
    )
    # Using an integer field instead of a foreign key to avoid circular imports
    category_id = models.IntegerField(null=True, blank=True)
    tax_type = models.CharField(max_length=50)
    tax_code = models.CharField(max_length=50)
    tax_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    price_from = models.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        null=True, 
        blank=True
    )
    price_to = models.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        null=True, 
        blank=True
    )
    description = models.TextField(blank=True, null=True, help_text="Description of the tax rate")
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_tax_rates'
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='updated_tax_rates'
    )
    
    class Meta:
        ordering = ['tax_code']
    
    def __str__(self):
        return f"{self.tax_code} ({self.tax_percentage}%)"


class TaxRateProfile(TimestampedModel):
    """
    Tax rate profile model for grouping tax rates.
    
    Tax rate profiles can be used to group multiple tax rates together for
    easier assignment to products or categories.
    """
    client = models.ForeignKey(
        settings.TENANT_MODEL, 
        on_delete=models.CASCADE, 
        related_name='tax_rate_profiles'
    )
    company_id = models.IntegerField(default=1)
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=50, blank=True, default='')
    description = models.TextField(blank=True, default='')
    tax_rates = models.ManyToManyField(
        TaxRate, 
        blank=True, 
        related_name='profiles'
    )
    is_default = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_tax_rate_profiles'
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='updated_tax_rate_profiles'
    )
    
    class Meta:
        unique_together = ('client', 'name')
        ordering = ['name']
    
    def __str__(self):
        return self.name

"""
Shared models for use across the application.

These models are stored in the public schema and are accessible to all tenants.
"""
from django.db import models
from django.conf import settings
from core.models.base import AuditableModel


class Country(AuditableModel):
    """
    Country model for use across the application.
    
    This model is stored in the public schema and accessible to all tenants.
    It provides a standard list of countries with ISO codes.
    """
    id = models.AutoField(primary_key=True)
    client = models.ForeignKey(
        settings.TENANT_MODEL, 
        on_delete=models.CASCADE, 
        related_name='countries',
        null=True,
        blank=True
    )
    company_id = models.IntegerField(default=1)
    iso_code = models.CharField(max_length=2, unique=True)
    iso_code_3 = models.CharField(max_length=3, unique=True, null=True, blank=True)
    name = models.CharField(max_length=100, unique=True)
    is_active = models.BooleanField(default=True)
    flag_url = models.URLField(blank=True, null=True)
    phone_code = models.CharField(max_length=10, blank=True, null=True)
    
    class Meta:
        verbose_name_plural = "Countries"
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Currency(AuditableModel):
    """
    Currency model for use across the application.
    
    This model is stored in the public schema and accessible to all tenants.
    It provides a standard list of currencies with ISO codes.
    """
    id = models.AutoField(primary_key=True)
    client = models.ForeignKey(
        settings.TENANT_MODEL, 
        on_delete=models.CASCADE, 
        related_name='currencies',
        null=True,
        blank=True
    )
    company_id = models.IntegerField(default=1)
    code = models.CharField(max_length=3, unique=True)
    name = models.CharField(max_length=100, unique=True)
    symbol = models.CharField(max_length=5)
    is_active = models.BooleanField(default=True)
    exchange_rate_to_usd = models.DecimalField(
        max_digits=14, 
        decimal_places=6,
        default=1.0,
        help_text="Exchange rate to USD"
    )
    
    class Meta:
        verbose_name_plural = "Currencies"
        ordering = ['code']
    
    def __str__(self):
        return f"{self.name} ({self.code})"

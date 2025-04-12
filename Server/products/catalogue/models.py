from django.db import models
from django.conf import settings
from core.models.base import AuditableModel


# Keeping this for backward compatibility but not using it anymore
class TimestampedModel(models.Model):
    """
    An abstract base model that provides self-updating
    created_at and updated_at fields.
    """
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Division(AuditableModel):
    """
    Division model represents the highest level in the product catalogue hierarchy.
    """
    client_id = models.IntegerField(default=1, editable=False, help_text="External client identifier (fixed value)")
    company_id = models.IntegerField(default=1, editable=False, help_text="External company identifier (fixed value)")
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='divisions/', blank=True, null=True)
    image_alt_text = models.CharField(max_length=255, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ('client_id', 'name')
        ordering = ['id']

    def __str__(self):
        return self.name


class Category(AuditableModel):
    """
    Category model represents the middle level in the product catalogue hierarchy.
    """
    client_id = models.IntegerField(default=1, editable=False, help_text="External client identifier (fixed value)")
    company_id = models.IntegerField(default=1, editable=False, help_text="External company identifier (fixed value)")
    division = models.ForeignKey(
        Division, 
        on_delete=models.CASCADE, 
        related_name='categories'
    )
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    image_alt_text = models.CharField(max_length=255, blank=True)
    # Temporarily commenting out this field until the pricing app is created
    # default_tax_rate_profile = models.ForeignKey(
    #     'pricing.TaxRateProfile', 
    #     on_delete=models.SET_NULL, 
    #     null=True, 
    #     blank=True, 
    #     related_name='default_for_categories'
    # )
    default_tax_rate = models.DecimalField(max_digits=6, decimal_places=2, default=0.00, blank=True, null=True)
    tax_inclusive = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'products_category'
        unique_together = ('client_id', 'division', 'name')
        ordering = ['division__name', 'sort_order', 'name']
       

    def __str__(self):
        return f"{self.division.name} > {self.name}"


class Subcategory(AuditableModel):
    """
    Subcategory model represents the lowest level in the product catalogue hierarchy.
    """
    client_id = models.IntegerField(default=1, editable=False, help_text="External client identifier (fixed value)")
    company_id = models.IntegerField(default=1, editable=False, help_text="External company identifier (fixed value)")
    category = models.ForeignKey(
        Category, 
        on_delete=models.CASCADE, 
        related_name='subcategories'
    )
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='subcategories/', blank=True, null=True)
    image_alt_text = models.CharField(max_length=255, blank=True)
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ('client_id', 'category', 'name')
        ordering = ['id']

    def __str__(self):
        return f"{self.category} > {self.name}"


class UomType(models.TextChoices):
    """
    Choices for Unit of Measure types.
    """
    COUNTABLE = 'COUNTABLE', 'Countable'
    MEASURABLE = 'MEASURABLE', 'Measurable'


class UnitOfMeasure(AuditableModel):
    """
    UnitOfMeasure model represents the units used to measure products.
    """
    client_id = models.IntegerField(default=1, editable=False, help_text="External client identifier (fixed value)")
    company_id = models.IntegerField(default=1, editable=False, help_text="External company identifier (fixed value)")
    name = models.CharField(max_length=50)  # e.g., Pieces, Kilograms, Liters
    symbol = models.CharField(max_length=10)  # e.g., PCS, KG, LTR
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    unit_type = models.CharField(
        max_length=10, 
        choices=UomType.choices, 
        default=UomType.COUNTABLE,
        help_text="Determines if the unit is typically counted in whole numbers or measured with decimal values"
    )
    associated_value = models.DecimalField(
        max_digits=10, 
        decimal_places=4, 
        null=True, 
        blank=True,
        help_text="Numeric value associated with this unit of measure"
    )

    class Meta:
        unique_together = [('client_id', 'symbol'), ('client_id', 'name')]
        ordering = ['name']

    def __str__(self):
        return self.name


class ProductStatus(AuditableModel):
    """
    ProductStatus model represents the possible statuses of products.
    """
    client_id = models.IntegerField(default=1, editable=False, help_text="External client identifier (fixed value)")
    company_id = models.IntegerField(default=1, editable=False, help_text="External company identifier (fixed value)")
    name = models.CharField(max_length=50)  # e.g., New, Available, Discontinued, Pre-Order
    description = models.TextField(blank=True, help_text="Optional description of the product status")
    is_active = models.BooleanField(default=True, help_text="Whether this status is active and available for use")
    is_orderable = models.BooleanField(default=True, help_text="Can products with this status be ordered?")

    class Meta:
        unique_together = ('client_id', 'name')
        ordering = ['id']

    def __str__(self):
        return self.name

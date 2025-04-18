# Generated by Django 5.1.7 on 2025-03-28 12:07

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Tenant",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "client_id",
                    models.IntegerField(
                        default=1,
                        editable=False,
                        help_text="External client identifier (fixed value)",
                    ),
                ),
                ("name", models.CharField(max_length=100)),
                ("schema_name", models.CharField(max_length=63, unique=True)),
                ("paid_until", models.DateField(blank=True, null=True)),
                ("on_trial", models.BooleanField(default=True)),
                ("created_on", models.DateField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name="TenantSetting",
            fields=[
                (
                    "created_at",
                    models.DateTimeField(
                        default=django.utils.timezone.now, editable=False
                    ),
                ),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "client",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        primary_key=True,
                        related_name="settings",
                        serialize=False,
                        to="tenants.tenant",
                    ),
                ),
                ("base_currency", models.CharField(default="USD", max_length=3)),
                ("tax_inclusive_pricing_global", models.BooleanField(default=False)),
                ("customer_group_pricing_enabled", models.BooleanField(default=False)),
                ("product_reviews_enabled", models.BooleanField(default=True)),
                ("product_reviews_auto_approval", models.BooleanField(default=False)),
                ("inventory_management_enabled", models.BooleanField(default=True)),
                ("backorders_enabled", models.BooleanField(default=False)),
                (
                    "sku_prefix",
                    models.CharField(blank=True, default="SKU-", max_length=10),
                ),
                ("sku_include_attributes", models.BooleanField(default=False)),
                (
                    "sku_format",
                    models.CharField(
                        blank=True, default="{prefix}{product_id}", max_length=100
                    ),
                ),
            ],
            options={
                "ordering": ["-created_at"],
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="Domain",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("domain", models.CharField(max_length=253, unique=True)),
                ("is_primary", models.BooleanField(default=True)),
                (
                    "tenant",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="domains",
                        to="tenants.tenant",
                    ),
                ),
            ],
        ),
    ]

# Generated by Django 5.1.7 on 2025-04-10 08:58

import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("attributes", "0006_attribute_is_active"),
        ("pricing", "0010_alter_taxrateprofile_code_and_more"),
        ("products", "0001_initial"),
        ("shared", "0002_country_iso_code_3"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="KitComponent",
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
                    "created_at",
                    models.DateTimeField(
                        default=django.utils.timezone.now, editable=False
                    ),
                ),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("client_id", models.IntegerField(default=1)),
                ("company_id", models.IntegerField(default=1)),
                ("quantity", models.PositiveIntegerField(default=1)),
                (
                    "is_swappable_group",
                    models.BooleanField(
                        default=False,
                        help_text="If True, component_product MUST be a PARENT product, and its variants are the options.",
                    ),
                ),
            ],
            options={
                "verbose_name": "Kit Component",
                "verbose_name_plural": "Kit Components",
                "ordering": ["kit_product", "id"],
            },
        ),
        migrations.CreateModel(
            name="Product",
            fields=[
                (
                    "created_at",
                    models.DateTimeField(
                        default=django.utils.timezone.now, editable=False
                    ),
                ),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("client_id", models.IntegerField(default=1)),
                ("company_id", models.IntegerField(default=1)),
                (
                    "product_type",
                    models.CharField(
                        choices=[
                            ("REGULAR", "Regular Product"),
                            ("PARENT", "Parent Product (with Variants)"),
                            ("KIT", "Kit/Bundle Product"),
                        ],
                        default="REGULAR",
                        max_length=10,
                    ),
                ),
                (
                    "publication_status",
                    models.CharField(
                        choices=[
                            ("DRAFT", "Draft"),
                            ("ACTIVE", "Active"),
                            ("ARCHIVED", "Archived"),
                        ],
                        db_index=True,
                        default="DRAFT",
                        help_text="Current publication status of the product",
                        max_length=10,
                    ),
                ),
                ("name", models.CharField(max_length=255)),
                ("slug", models.SlugField(max_length=255)),
                ("sku", models.CharField(blank=True, max_length=100, null=True)),
                ("description", models.TextField(blank=True)),
                ("short_description", models.TextField(blank=True)),
                ("is_tax_exempt", models.BooleanField(default=False)),
                (
                    "display_price",
                    models.DecimalField(
                        blank=True, decimal_places=2, max_digits=12, null=True
                    ),
                ),
                (
                    "compare_at_price",
                    models.DecimalField(
                        blank=True,
                        decimal_places=2,
                        help_text="Original price for comparison (e.g., for sale items)",
                        max_digits=12,
                        null=True,
                    ),
                ),
                ("is_active", models.BooleanField(default=True)),
                ("allow_reviews", models.BooleanField(default=True)),
                ("inventory_tracking_enabled", models.BooleanField(default=True)),
                ("backorders_allowed", models.BooleanField(default=False)),
                ("quantity_on_hand", models.IntegerField(default=0)),
                (
                    "is_serialized",
                    models.BooleanField(
                        default=False,
                        help_text="Whether this product has serial numbers",
                    ),
                ),
                (
                    "is_lotted",
                    models.BooleanField(
                        default=False,
                        help_text="Whether this product is tracked by lot/batch numbers",
                    ),
                ),
                (
                    "pre_order_available",
                    models.BooleanField(
                        default=False,
                        help_text="Whether this product can be pre-ordered",
                    ),
                ),
                (
                    "pre_order_date",
                    models.DateField(
                        blank=True,
                        help_text="Date when pre-ordered items will be available",
                        null=True,
                    ),
                ),
                ("seo_title", models.CharField(blank=True, max_length=70)),
                ("seo_description", models.CharField(blank=True, max_length=160)),
                ("seo_keywords", models.CharField(blank=True, max_length=255)),
                (
                    "tags",
                    models.JSONField(
                        blank=True,
                        help_text="Product tags stored as a JSON array of strings",
                        null=True,
                    ),
                ),
                (
                    "faqs",
                    models.JSONField(
                        blank=True,
                        help_text='Store as list of objects: [{"question": "...", "answer": "..."}, ...]',
                        null=True,
                    ),
                ),
            ],
            options={
                "ordering": ["name"],
            },
        ),
        migrations.CreateModel(
            name="ProductAttributeMultiValue",
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
                    "attribute_option",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="product_values_multi",
                        to="attributes.attributeoption",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="ProductAttributeValue",
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
                    "created_at",
                    models.DateTimeField(
                        default=django.utils.timezone.now, editable=False
                    ),
                ),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("client_id", models.IntegerField(default=1)),
                ("company_id", models.IntegerField(default=1)),
                ("value_text", models.TextField(blank=True, null=True)),
                (
                    "value_number",
                    models.DecimalField(
                        blank=True, decimal_places=4, max_digits=12, null=True
                    ),
                ),
                ("value_boolean", models.BooleanField(blank=True, null=True)),
                ("value_date", models.DateField(blank=True, null=True)),
                (
                    "attribute",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="product_values",
                        to="attributes.attribute",
                    ),
                ),
            ],
            options={
                "ordering": ["product", "attribute"],
            },
        ),
        migrations.CreateModel(
            name="ProductImage",
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
                    "created_at",
                    models.DateTimeField(
                        default=django.utils.timezone.now, editable=False
                    ),
                ),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("client_id", models.IntegerField(default=1)),
                ("company_id", models.IntegerField(default=1)),
                ("image", models.ImageField(upload_to="products/%Y/%m/")),
                ("alt_text", models.CharField(blank=True, max_length=255)),
                ("sort_order", models.PositiveIntegerField(default=0)),
                ("is_default", models.BooleanField(default=False)),
            ],
            options={
                "ordering": ["product", "sort_order"],
            },
        ),
        migrations.CreateModel(
            name="ProductVariant",
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
                    "created_at",
                    models.DateTimeField(
                        default=django.utils.timezone.now, editable=False
                    ),
                ),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("client_id", models.IntegerField(default=1)),
                ("company_id", models.IntegerField(default=1)),
                ("sku", models.CharField(max_length=100)),
                ("display_price", models.DecimalField(decimal_places=2, max_digits=12)),
                ("is_active", models.BooleanField(default=True)),
                ("quantity_on_hand", models.IntegerField(default=0)),
                (
                    "weight",
                    models.DecimalField(
                        blank=True, decimal_places=2, max_digits=8, null=True
                    ),
                ),
                (
                    "height",
                    models.DecimalField(
                        blank=True, decimal_places=2, max_digits=8, null=True
                    ),
                ),
                (
                    "length",
                    models.DecimalField(
                        blank=True, decimal_places=2, max_digits=8, null=True
                    ),
                ),
                (
                    "width",
                    models.DecimalField(
                        blank=True, decimal_places=2, max_digits=8, null=True
                    ),
                ),
            ],
            options={
                "verbose_name": "Product Variant",
                "verbose_name_plural": "Product Variants",
                "ordering": ["product", "sku"],
            },
        ),
        migrations.DeleteModel(
            name="ProductCategory",
        ),
        migrations.AlterModelOptions(
            name="division",
            options={"ordering": ["id"]},
        ),
        migrations.AlterModelOptions(
            name="productstatus",
            options={"ordering": ["id"]},
        ),
        migrations.AddField(
            model_name="productstatus",
            name="description",
            field=models.TextField(
                blank=True, help_text="Optional description of the product status"
            ),
        ),
        migrations.AddField(
            model_name="productstatus",
            name="is_active",
            field=models.BooleanField(
                default=True,
                help_text="Whether this status is active and available for use",
            ),
        ),
        migrations.AlterField(
            model_name="productstatus",
            name="is_orderable",
            field=models.BooleanField(
                default=True, help_text="Can products with this status be ordered?"
            ),
        ),
        migrations.AlterModelTable(
            name="category",
            table="products_category",
        ),
        migrations.AddField(
            model_name="product",
            name="category",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name="products",
                to="products.category",
            ),
        ),
        migrations.AddField(
            model_name="product",
            name="created_by",
            field=models.ForeignKey(
                editable=False,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="%(app_label)s_%(class)s_created",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AddField(
            model_name="product",
            name="currency_code",
            field=models.ForeignKey(
                help_text="Currency for product pricing",
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="products",
                to="shared.currency",
            ),
        ),
        migrations.AddField(
            model_name="product",
            name="default_tax_rate_profile",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="default_for_products",
                to="pricing.taxrateprofile",
            ),
        ),
        migrations.AddField(
            model_name="product",
            name="division",
            field=models.ForeignKey(
                help_text="Division this product belongs to",
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="products",
                to="products.division",
            ),
        ),
        migrations.AddField(
            model_name="product",
            name="productstatus",
            field=models.ForeignKey(
                help_text="Current status of this product",
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="products",
                to="products.productstatus",
            ),
        ),
        migrations.AddField(
            model_name="product",
            name="subcategory",
            field=models.ForeignKey(
                blank=True,
                help_text="Subcategory this product belongs to",
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="products",
                to="products.subcategory",
            ),
        ),
        migrations.AddField(
            model_name="product",
            name="uom",
            field=models.ForeignKey(
                help_text="Unit of measure for this product",
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="products",
                to="products.unitofmeasure",
            ),
        ),
        migrations.AddField(
            model_name="product",
            name="updated_by",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="%(app_label)s_%(class)s_updated",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AddField(
            model_name="kitcomponent",
            name="component_product",
            field=models.ForeignKey(
                blank=True,
                help_text="Link to a REGULAR product component OR the PARENT product for a swappable group.",
                limit_choices_to={"product_type": "REGULAR"},
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="+",
                to="products.product",
            ),
        ),
        migrations.AddField(
            model_name="kitcomponent",
            name="kit_product",
            field=models.ForeignKey(
                help_text="The KIT product that contains this component",
                limit_choices_to={"product_type": "KIT"},
                on_delete=django.db.models.deletion.CASCADE,
                related_name="kit_components",
                to="products.product",
            ),
        ),
        migrations.AddField(
            model_name="productattributevalue",
            name="product",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="attribute_values",
                to="products.product",
            ),
        ),
        migrations.AddField(
            model_name="productattributevalue",
            name="value_option",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="product_values_single",
                to="attributes.attributeoption",
            ),
        ),
        migrations.AddField(
            model_name="productattributemultivalue",
            name="product_attribute_value",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="multi_values",
                to="products.productattributevalue",
            ),
        ),
        migrations.AddField(
            model_name="productimage",
            name="product",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="images",
                to="products.product",
            ),
        ),
        migrations.AddField(
            model_name="productvariant",
            name="image",
            field=models.ForeignKey(
                blank=True,
                help_text="Optional variant-specific default image.",
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="variant_default_image",
                to="products.productimage",
            ),
        ),
        migrations.AddField(
            model_name="productvariant",
            name="options",
            field=models.ManyToManyField(
                help_text="Attribute options defining this variant (e.g., Red, Small)",
                related_name="variants",
                to="attributes.attributeoption",
            ),
        ),
        migrations.AddField(
            model_name="productvariant",
            name="product",
            field=models.ForeignKey(
                limit_choices_to={"product_type": "PARENT"},
                on_delete=django.db.models.deletion.CASCADE,
                related_name="variants",
                to="products.product",
            ),
        ),
        migrations.AddField(
            model_name="kitcomponent",
            name="component_variant",
            field=models.ForeignKey(
                blank=True,
                help_text="Link to a specific VARIANT product component.",
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="+",
                to="products.productvariant",
            ),
        ),
        migrations.AlterUniqueTogether(
            name="product",
            unique_together={("client_id", "sku"), ("client_id", "slug")},
        ),
        migrations.AlterUniqueTogether(
            name="productattributevalue",
            unique_together={("client_id", "product", "attribute")},
        ),
        migrations.AlterUniqueTogether(
            name="productattributemultivalue",
            unique_together={("product_attribute_value", "attribute_option")},
        ),
        migrations.AlterUniqueTogether(
            name="productvariant",
            unique_together={("client_id", "sku")},
        ),
        migrations.AddConstraint(
            model_name="kitcomponent",
            constraint=models.CheckConstraint(
                check=models.Q(
                    models.Q(
                        ("component_product__isnull", False),
                        ("component_variant__isnull", True),
                    ),
                    models.Q(
                        ("component_product__isnull", True),
                        ("component_variant__isnull", False),
                    ),
                    _connector="OR",
                ),
                name="component_product_or_variant_set",
            ),
        ),
        migrations.AddConstraint(
            model_name="kitcomponent",
            constraint=models.CheckConstraint(
                check=models.Q(
                    ("is_swappable_group", False),
                    ("component_product__isnull", False),
                    _connector="OR",
                ),
                name="swappable_requires_component_product",
            ),
        ),
    ]

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0006_alter_product_unique_together_alter_product_sku'),
    ]

    operations = [
        # Remove physical attribute fields
        migrations.RemoveField(
            model_name='productvariant',
            name='weight',
        ),
        migrations.RemoveField(
            model_name='productvariant',
            name='height',
        ),
        migrations.RemoveField(
            model_name='productvariant',
            name='length',
        ),
        migrations.RemoveField(
            model_name='productvariant',
            name='width',
        ),
        
        # Add status_override field
        migrations.AddField(
            model_name='productvariant',
            name='status_override',
            field=models.ForeignKey(
                blank=True,
                help_text='Optional override of the parent product status.',
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name='variant_statuses',
                to='products.productstatus',
            ),
        ),
    ]

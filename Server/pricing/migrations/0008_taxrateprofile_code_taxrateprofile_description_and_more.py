# Generated by Django 5.1.7 on 2025-04-02 07:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("pricing", "0007_alter_taxrate_options_remove_taxrate_tax_region"),
    ]

    operations = [
        migrations.AddField(
            model_name="taxrateprofile",
            name="code",
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AddField(
            model_name="taxrateprofile",
            name="description",
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="taxrateprofile",
            name="is_default",
            field=models.BooleanField(default=False),
        ),
    ]

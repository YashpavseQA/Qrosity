# Generated by Django 5.2 on 2025-04-07 05:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("attributes", "0005_attribute_is_active"),
    ]

    operations = [
        migrations.AddField(
            model_name="attribute",
            name="is_active",
            field=models.BooleanField(default=True),
        ),
    ]

# Generated by Django 5.1.7 on 2025-04-02 15:14

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("attributes", "0003_add_show_on_pdp_field"),
    ]

    operations = [
        # This was supposed to rename display_on_pdp to show_on_pdp,
        # but show_on_pdp was already added in migration 0003 and display_on_pdp doesn't exist
        # So we're making this a no-op migration
    ]

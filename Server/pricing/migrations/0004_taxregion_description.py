from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pricing', '0003_fix_taxregion_countries_column_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='taxregion',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
    ]

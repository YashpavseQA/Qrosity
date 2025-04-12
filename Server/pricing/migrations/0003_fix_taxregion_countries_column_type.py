from django.db import migrations

class Migration(migrations.Migration):
    dependencies = [
        ('pricing', '0002_customergroup_code_customergroup_description_and_more'),
    ]

    operations = [
        migrations.RunSQL(
            # Forward SQL - Fix the column type
            """
            -- Drop the existing foreign key constraint
            ALTER TABLE pricing_taxregion_countries 
            DROP CONSTRAINT IF EXISTS pricing_taxregion_countries_country_id_fkey;
            
            -- Alter the column type from varchar to integer
            ALTER TABLE pricing_taxregion_countries 
            ALTER COLUMN country_id TYPE integer USING country_id::integer;
            
            -- Recreate the foreign key constraint
            ALTER TABLE pricing_taxregion_countries
            ADD CONSTRAINT pricing_taxregion_countries_country_id_fkey
            FOREIGN KEY (country_id) REFERENCES shared_country(id);
            """,
            
            # Reverse SQL (if you need to roll back)
            """
            -- This is intentionally left empty as converting back could cause data loss
            """
        ),
    ]

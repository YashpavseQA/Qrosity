-- SQL script to manually apply the migration changes
-- This removes the physical attribute columns and adds the status_override field

-- Remove physical attribute columns
ALTER TABLE products_productvariant DROP COLUMN IF EXISTS weight;
ALTER TABLE products_productvariant DROP COLUMN IF EXISTS height;
ALTER TABLE products_productvariant DROP COLUMN IF EXISTS length;
ALTER TABLE products_productvariant DROP COLUMN IF EXISTS width;

-- Add status_override column with foreign key constraint
-- First check if the column already exists to avoid errors
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name='products_productvariant' AND column_name='status_override_id'
    ) THEN
        ALTER TABLE products_productvariant 
        ADD COLUMN status_override_id bigint NULL;
        
        -- Add foreign key constraint
        ALTER TABLE products_productvariant
        ADD CONSTRAINT fk_productvariant_status_override
        FOREIGN KEY (status_override_id) 
        REFERENCES products_productstatus(id)
        ON DELETE RESTRICT;
    END IF;
END
$$;

-- Update Django's migration record to mark this migration as applied
-- This assumes you're using Django's default migration table name
INSERT INTO django_migrations (app, name, applied)
SELECT 
    'products', 
    '0007_remove_variant_physical_attributes', 
    NOW()
WHERE NOT EXISTS (
    SELECT 1 
    FROM django_migrations 
    WHERE app = 'products' AND name = '0007_remove_variant_physical_attributes'
);

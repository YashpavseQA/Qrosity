import os
import django
import sys

# Set up Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'erp_backend.settings')
django.setup()

# Import models after Django setup
from products.models import Product, ProductVariant
from attributes.models import AttributeOption
from django.db import transaction
from decimal import Decimal

def add_test_variant():
    """
    Add a test variant to an existing product
    """
    try:
        # First, list all available attribute options
        print("Available attribute options:")
        all_options = AttributeOption.objects.all()
        if all_options.exists():
            for option in all_options:
                print(f"ID: {option.id}, Value: {option.option_value}, Attribute: {option.attribute.name}")
        else:
            print("No attribute options found in the database.")
            return
        
        # Get the product to add variant to (replace 140 with your product ID)
        product_id = 140
        try:
            product = Product.objects.get(id=product_id)
            print(f"Found product: {product.name} (ID: {product.id})")
        except Product.DoesNotExist:
            print(f"Product with ID {product_id} not found.")
            return
        
        # Get existing attribute options (replace with actual option IDs that exist in your database)
        # You can modify these IDs based on what exists in your database
        option_ids = [1, 2, 3, 4]  # Replace with actual IDs
        options = AttributeOption.objects.filter(id__in=option_ids)
        
        if not options:
            print("No attribute options found with the specified IDs.")
            return
        
        with transaction.atomic():
            # Create a new variant
            variant = ProductVariant.objects.create(
                product=product,
                sku=f"TEST_VARIANT_{product.id}",
                display_price=Decimal('99.99'),
                is_active=True,
                quantity_on_hand=100,
                # Add other fields as needed
            )
            
            # Add options to the variant
            variant.options.set(options)
            
            print(f"Successfully created variant with ID: {variant.id}")
            print(f"SKU: {variant.sku}")
            print(f"Price: {variant.display_price}")
            print(f"Options: {', '.join([str(o.option_value) for o in variant.options.all()])}")
            
    except Exception as e:
        print(f"Error creating variant: {str(e)}")

if __name__ == "__main__":
    add_test_variant()

"""
Script to run the SQL commands in db_update.sql
"""
import os
import django
import sys

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'erp_backend.settings')
django.setup()

from django.db import connection

def main():
    # Read SQL file
    with open('db_update.sql', 'r') as f:
        sql_content = f.read()
    
    # Execute SQL commands
    with connection.cursor() as cursor:
        try:
            cursor.execute(sql_content)
            print("Successfully executed SQL commands")
        except Exception as e:
            print(f"Error executing SQL: {e}")
    
    print("Database update completed!")

if __name__ == "__main__":
    main()

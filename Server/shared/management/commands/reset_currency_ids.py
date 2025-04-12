"""
Management command to reset currency IDs to start from 1.

This command will:
1. Fetch all currencies
2. Create a backup of existing data
3. Delete all currencies
4. Reset the sequence for the currency table
5. Re-create all currencies with new sequential IDs
"""
from django.core.management.base import BaseCommand
from django.db import connection
from shared.models import Currency
import json
import os
from datetime import datetime


class Command(BaseCommand):
    help = 'Reset currency IDs to start from 1'

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING('Starting currency ID reset process...'))
        
        # Step 1: Fetch all currencies and create a backup
        currencies = Currency.objects.all().order_by('id')
        self.stdout.write(self.style.SUCCESS(f'Found {currencies.count()} currencies'))
        
        # Create a backup of the data
        backup_data = []
        for currency in currencies:
            backup_data.append({
                'id': currency.id,
                'code': currency.code,
                'name': currency.name,
                'symbol': currency.symbol,
                'exchange_rate_to_usd': float(currency.exchange_rate_to_usd),
                'is_active': currency.is_active,
                'client_id': currency.client_id if currency.client else None,
                'company_id': currency.company_id,
                'created_by_id': currency.created_by_id,
                'updated_by_id': currency.updated_by_id,
                'created_at': currency.created_at.isoformat(),
                'updated_at': currency.updated_at.isoformat(),
            })
        
        # Save backup to file
        backup_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'backups')
        os.makedirs(backup_dir, exist_ok=True)
        backup_file = os.path.join(backup_dir, f'currency_backup_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json')
        with open(backup_file, 'w') as f:
            json.dump(backup_data, f, indent=2)
        self.stdout.write(self.style.SUCCESS(f'Backup created at {backup_file}'))
        
        # Step 2: Delete all currencies
        self.stdout.write(self.style.WARNING('Deleting all currencies...'))
        Currency.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('All currencies deleted'))
        
        # Step 3: Reset the sequence
        with connection.cursor() as cursor:
            cursor.execute("SELECT setval(pg_get_serial_sequence('shared_currency', 'id'), 1, false);")
        self.stdout.write(self.style.SUCCESS('Currency ID sequence reset to start from 1'))
        
        # Step 4: Re-create all currencies with new IDs
        self.stdout.write(self.style.WARNING('Re-creating currencies with new IDs...'))
        for data in backup_data:
            Currency.objects.create(
                code=data['code'],
                name=data['name'],
                symbol=data['symbol'],
                exchange_rate_to_usd=data['exchange_rate_to_usd'],
                is_active=data['is_active'],
                client_id=data['client_id'],
                company_id=data['company_id'],
                created_by_id=data['created_by_id'],
                updated_by_id=data['updated_by_id'],
            )
        
        # Verify the reset
        new_count = Currency.objects.count()
        self.stdout.write(self.style.SUCCESS(f'Successfully re-created {new_count} currencies with sequential IDs starting from 1'))
        first_id = Currency.objects.order_by('id').first().id
        last_id = Currency.objects.order_by('id').last().id
        self.stdout.write(self.style.SUCCESS(f'Currency IDs now range from {first_id} to {last_id}'))

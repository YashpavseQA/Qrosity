"""
Management command to seed Country and Currency data.

This command populates the Country and Currency models with standard data
from django-countries and pycountry libraries. It is designed to be idempotent
and can be run multiple times without creating duplicate entries.
"""
import pycountry
from django.core.management.base import BaseCommand
from django.db import transaction
from django_countries import countries
from django_countries.fields import Country as DjangoCountry
from shared.models import Country, Currency


class Command(BaseCommand):
    help = 'Seeds the database with standard country and currency data'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting to seed shared data...'))
        
        # Seed countries
        self._seed_countries()
        
        # Seed currencies
        self._seed_currencies()
        
        self.stdout.write(self.style.SUCCESS('Shared data seeding completed successfully!'))
    
    @transaction.atomic
    def _seed_countries(self):
        """
        Seeds the Country model with data from django-countries.
        Uses update_or_create to ensure idempotency.
        """
        self.stdout.write('Seeding Countries...')
        count = 0
        
        # Phone code mapping (ISO alpha-2 to phone code)
        phone_codes = {
            'US': '1',
            'GB': '44',
            'IN': '91',
            'AU': '61',
            'CA': '1',
            'DE': '49',
            'FR': '33',
            'IT': '39',
            'JP': '81',
            'CN': '86',
            'RU': '7',
            'BR': '55',
            'ZA': '27',
            'MX': '52',
            'ES': '34',
            'NL': '31',
            'SE': '46',
            'CH': '41',
            'NO': '47',
            'DK': '45',
            'FI': '358',
            'SG': '65',
            'NZ': '64',
            'AE': '971',
            'SA': '966',
            'IL': '972',
            'TR': '90',
            'PL': '48',
            'AT': '43',
            'BE': '32',
            'IE': '353',
            'PT': '351',
            'GR': '30',
            'HK': '852',
            'MY': '60',
            'TH': '66',
            'ID': '62',
            'PH': '63',
            'VN': '84',
            'KR': '82',
            'EG': '20',
            'ZA': '27',
            'NG': '234',
            'KE': '254',
            'MA': '212',
            'DZ': '213',
            'TN': '216',
            'GH': '233',
            'CI': '225',
            'CM': '237',
            'SN': '221',
        }
        
        # Get ISO 3-digit codes from pycountry
        iso3_codes = {country.alpha_2: country.alpha_3 for country in pycountry.countries}
        
        for code, name in dict(countries).items():
            # Get the ISO 3-digit code
            iso3 = iso3_codes.get(code, '')
            
            # Get the flag URL (django-countries provides flag URLs)
            flag_url = f'https://flagcdn.com/w320/{code.lower()}.png'
            
            # Get the phone code
            phone_code = phone_codes.get(code, '')
            
            defaults = {
                'name': name,
                'iso_code_3': iso3,  # Add the ISO 3-digit code
                'is_active': True,
                'flag_url': flag_url,
                'phone_code': phone_code,
                'client_id': 1,
                'company_id': 1,
                'created_by_id': 1,
                'updated_by_id': 1,
            }
            
            # Update or create the country
            obj, created = Country.objects.update_or_create(
                iso_code=code,
                defaults=defaults
            )
            
            count += 1
            if created:
                self.stdout.write(f'  Created country: {obj.name} ({code}, {iso3}, {phone_code})')
            else:
                self.stdout.write(f'  Updated country: {obj.name} ({code}, {iso3}, {phone_code})')
        
        self.stdout.write(self.style.SUCCESS(f'Seeded {count} countries'))
    
    @transaction.atomic
    def _seed_currencies(self):
        """
        Seeds the Currency model with data from pycountry.currencies.
        Uses update_or_create to ensure idempotency.
        """
        self.stdout.write('Seeding Currencies...')
        count = 0
        
        # Define common currencies with their symbols
        common_currencies = {
            'USD': {'name': 'US Dollar', 'symbol': '$'},
            'EUR': {'name': 'Euro', 'symbol': '€'},
            'GBP': {'name': 'British Pound', 'symbol': '£'},
            'JPY': {'name': 'Japanese Yen', 'symbol': '¥'},
            'AUD': {'name': 'Australian Dollar', 'symbol': 'A$'},
            'CAD': {'name': 'Canadian Dollar', 'symbol': 'C$'},
            'CHF': {'name': 'Swiss Franc', 'symbol': 'Fr'},
            'CNY': {'name': 'Chinese Yuan', 'symbol': '¥'},
            'INR': {'name': 'Indian Rupee', 'symbol': '₹'},
            'RUB': {'name': 'Russian Ruble', 'symbol': '₽'},
            'BRL': {'name': 'Brazilian Real', 'symbol': 'R$'},
            'ZAR': {'name': 'South African Rand', 'symbol': 'R'},
            'MXN': {'name': 'Mexican Peso', 'symbol': '$'},
            'SGD': {'name': 'Singapore Dollar', 'symbol': 'S$'},
            'NZD': {'name': 'New Zealand Dollar', 'symbol': 'NZ$'},
            'HKD': {'name': 'Hong Kong Dollar', 'symbol': 'HK$'},
            'SEK': {'name': 'Swedish Krona', 'symbol': 'kr'},
            'NOK': {'name': 'Norwegian Krone', 'symbol': 'kr'},
            'DKK': {'name': 'Danish Krone', 'symbol': 'kr'},
            'AED': {'name': 'United Arab Emirates Dirham', 'symbol': 'د.إ'},
        }
        
        # First add common currencies with proper symbols
        for code, data in common_currencies.items():
            defaults = {
                'name': data['name'],
                'symbol': data['symbol'],
                'is_active': True,
                'exchange_rate_to_usd': 1.0 if code == 'USD' else 1.0,  # Default exchange rate
                'client_id': 1,
                'company_id': 1,
                'created_by_id': 1,
                'updated_by_id': 1,
            }
            
            # Update or create the currency
            obj, created = Currency.objects.update_or_create(
                code=code,
                defaults=defaults
            )
            
            count += 1
            if created:
                self.stdout.write(f'  Created currency: {obj.name} ({obj.code})')
            else:
                self.stdout.write(f'  Updated currency: {obj.name} ({obj.code})')
        
        # Then add remaining currencies from pycountry
        for currency in list(pycountry.currencies):
            # Skip currencies we've already added
            if currency.alpha_3 in common_currencies:
                continue
                
            try:
                defaults = {
                    'name': currency.name,
                    'symbol': currency.alpha_3,  # Use code as symbol since pycountry doesn't provide symbols
                    'is_active': True,
                    'exchange_rate_to_usd': 1.0,  # Default exchange rate
                    'client_id': 1,
                    'company_id': 1,
                    'created_by_id': 1,
                    'updated_by_id': 1,
                }
                
                # Update or create the currency
                obj, created = Currency.objects.update_or_create(
                    code=currency.alpha_3,
                    defaults=defaults
                )
                
                count += 1
                if created:
                    self.stdout.write(f'  Created currency: {obj.name} ({obj.code})')
                else:
                    self.stdout.write(f'  Updated currency: {obj.name} ({obj.code})')
            except (AttributeError, Exception) as e:
                # Skip currencies that don't have the required attributes
                self.stdout.write(self.style.WARNING(f'  Skipped currency: {getattr(currency, "name", "Unknown")} - {str(e)}'))
        
        self.stdout.write(self.style.SUCCESS(f'Seeded {count} currencies'))

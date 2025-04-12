"""
Celery configuration for the ERP backend.

This module configures Celery for asynchronous task processing in the Django application.
It sets up the Celery app instance and configures it to auto-discover tasks in all installed apps.
"""
import os
from celery import Celery
from celery.schedules import crontab

# Set the default Django settings module for the 'celery' program
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'erp_backend.settings')

# Create the Celery app instance
app = Celery('erp_backend')

# Load configuration from Django settings using the namespace 'CELERY'
# This means all celery-related settings should have the prefix 'CELERY_'
app.config_from_object('django.conf:settings', namespace='CELERY')

# Auto-discover tasks in all installed apps
app.autodiscover_tasks()

# Configure periodic tasks
app.conf.beat_schedule = {
    'cleanup-temp-uploads-daily': {
        'task': 'products.tasks.cleanup_temporary_uploads',
        'schedule': crontab(hour=3, minute=0),  # Run daily at 3 AM
        'options': {'expires': 3600}  # Task expires after 1 hour
    },
}


@app.task(bind=True)
def debug_task(self):
    """
    Debug task to verify Celery is working correctly.
    
    This task simply prints information about the request to help with debugging.
    """
    print(f'Request: {self.request!r}')

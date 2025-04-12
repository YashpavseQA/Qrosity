"""
Abstract base models for the ERP backend.

This module defines abstract base models that can be inherited by other models
to provide common functionality and reduce code duplication.
"""
from django.db import models
from django.utils import timezone


class TimestampedModel(models.Model):
    """
    An abstract base model that provides created_at and updated_at fields.
    
    This model should be inherited by any model that needs to track when
    records were created and last updated.
    """
    created_at = models.DateTimeField(default=timezone.now, editable=False)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True
        ordering = ['-created_at']


class AuditableModel(TimestampedModel):
    """
    An abstract base model that extends TimestampedModel with audit fields.
    
    This model adds fields to track who created and last modified a record,
    which is useful for auditing purposes.
    """
    created_by = models.ForeignKey(
        'auth.User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='%(app_label)s_%(class)s_created',
        editable=False
    )
    updated_by = models.ForeignKey(
        'auth.User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='%(app_label)s_%(class)s_updated'
    )
    
    class Meta:
        abstract = True


class SoftDeleteModel(models.Model):
    """
    An abstract base model that provides soft delete functionality.
    
    Instead of permanently deleting records from the database, this model
    marks them as deleted by setting the is_deleted flag and deleted_at timestamp.
    """
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        abstract = True
    
    def delete(self, using=None, keep_parents=False):
        """
        Override the delete method to perform a soft delete.
        
        Instead of removing the record from the database, this method
        sets is_deleted to True and records the deletion timestamp.
        """
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save(update_fields=['is_deleted', 'deleted_at'])
    
    def hard_delete(self, using=None, keep_parents=False):
        """
        Permanently delete the record from the database.
        
        This method should be used when a record needs to be permanently
        removed, bypassing the soft delete mechanism.
        """
        return super().delete(using=using, keep_parents=keep_parents)

"""
URL configuration for tenant schemas.

This file defines URL patterns for tenant schemas, which include all tenant-specific
functionality such as API endpoints.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# Tenant-specific URL patterns
urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/v1/', include([
        path('products/', include('products.urls')),
        path('pricing/', include('pricing.urls')),
        path('attributes/', include('attributes.urls')),
        path('shared/', include('shared.urls')),  # Add shared app URLs
        path('', include('tenants.urls')),
        # Add other API endpoints here
    ])),
    
    # Add other tenant-specific URLs here
]

# Serve static and media files in development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

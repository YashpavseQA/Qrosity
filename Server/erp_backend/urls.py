"""
URL configuration for erp_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# This file is not used directly - see public_urls.py and tenant_urls.py
# This is just a placeholder for Django's URL system

urlpatterns = [
    # These patterns will be included in both public_urls.py and tenant_urls.py
    path('admin/', admin.site.urls),
    # API endpoints
    path('api/v1/', include([
        path('assets/', include('assets.urls')),
        path('products/', include('products.urls')),
        path('products/attributes/', include('attributes.urls')),  # Add attributes app URLs
        path('pricing/', include('pricing.urls')),
        path('shared/', include('shared.urls')),  # Add shared app URLs
        # Add other API endpoints here
    ])),
]

# Serve static and media files in development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

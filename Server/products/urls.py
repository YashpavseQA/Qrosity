from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from products.views import (
    ProductViewSet, ProductImageViewSet,
    ProductVariantViewSet, KitComponentViewSet,
    GcsTestView
)

# Create a router and register our viewsets with it
router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')

# Create nested routers for product-related resources
products_router = routers.NestedDefaultRouter(router, r'products', lookup='product')
products_router.register(r'images', ProductImageViewSet, basename='product-image')
products_router.register(r'variants', ProductVariantViewSet, basename='product-variant')
products_router.register(r'kit-components', KitComponentViewSet, basename='product-kitcomponent')

# The API URLs are now determined automatically by the router
urlpatterns = [
    path('', include(router.urls)),
    path('', include(products_router.urls)),
    path('catalogue/', include('products.catalogue.urls')),
    path('test-gcs/', GcsTestView.as_view({'get': 'test_gcs'}), name='test-gcs'),
]

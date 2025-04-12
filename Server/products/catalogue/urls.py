from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DivisionViewSet, CategoryViewSet, SubcategoryViewSet,
    UnitOfMeasureViewSet, ProductStatusViewSet
)

# Create a router and register our viewsets with it
router = DefaultRouter()
router.register(r'divisions', DivisionViewSet, basename='division')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'subcategories', SubcategoryViewSet, basename='subcategory')
router.register(r'units-of-measure', UnitOfMeasureViewSet, basename='unitofmeasure')
router.register(r'product-statuses', ProductStatusViewSet, basename='productstatus')

# The API URLs are determined automatically by the router
urlpatterns = [
    path('', include(router.urls)),
]

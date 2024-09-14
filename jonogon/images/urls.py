from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ImageViewset

# Create a router and register the CommentViewSet
router = DefaultRouter()
router.register(r'images', ImageViewset, basename='images')

urlpatterns = [
    # Include the router URLs
] + router.urls
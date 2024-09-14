from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CommentViewSet

# Create a router and register the CommentViewSet
router = DefaultRouter()
router.register(r'comments', CommentViewSet, basename='comments')

urlpatterns = [
    # Include the router URLs
] + router.urls
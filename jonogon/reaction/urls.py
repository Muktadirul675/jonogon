from .views import ReactionViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'reactions',ReactionViewSet, basename='reaction')

urlpatterns = [

] + router.urls

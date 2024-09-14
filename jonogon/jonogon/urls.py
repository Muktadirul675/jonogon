from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from . import settings
from post.views import populate

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('authentication.urls')),
    path('', include('reaction.urls')),
    path('', include('comment.urls')),
    path('', include('post.urls')),
    path('', include('images.urls')),
    path('populate', populate, name='populate'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

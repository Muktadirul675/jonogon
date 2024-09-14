from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from .serializers import ImageSerializer
from .models import Image
# Create your views here.

class ImageViewset(ModelViewSet):
    serializer_class = ImageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Image.objects.all()
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

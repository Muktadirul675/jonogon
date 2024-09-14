from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='images/profile/', default='/user.png')
    bio = models.CharField(max_length=200, default='Update your bio...')
    reputation = models.FloatField(default=1.0)

    def __str__(self):
        return f"{self.user}"

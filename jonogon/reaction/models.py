from django.db import models
from django.contrib.auth.models import User
from post.models import Post

# Create your models here.

REACTIONS = [
    ('Like','Like'),
    ('Love','Love'),
    ('Dislike','Dislike'),
]

class Reaction(models.Model):
    type = models.CharField(max_length=10, choices=REACTIONS)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, related_name='reactions', on_delete=models.CASCADE)
    post = models.ForeignKey(Post, related_name='reactions', on_delete=models.CASCADE)
    
    @property
    def point(self):
        if self.type == 'Like':
            return 1
        elif self.type == 'Love':
            return 2
        elif self.type == 'Dislike':
            return -1
        return 0
    
    def __str__(self):
        return f"{self.type} by {self.user}"
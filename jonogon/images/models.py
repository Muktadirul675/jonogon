from django.db import models
from post.models import Post
from comment.models import Comment
from django.contrib.auth.models import User

# Create your models here.

class Image(models.Model):
    image = models.ImageField(upload_to='posts/images/')
    user = models.ForeignKey(User, related_name='images', on_delete=models.CASCADE)
    post = models.ForeignKey(Post, related_name='images',on_delete=models.CASCADE, null=True, blank=True)
    comment = models.ForeignKey(Comment, related_name='images',on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        if self.post:
            return f'Post: {self.post}'
        if self.comment:
            return f'Comment: {self.comment}'
        else:
            return self.image.url

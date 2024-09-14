from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Post
from comment.models import Comment
from reaction.models import Reaction

@receiver(post_save, sender=Reaction)
@receiver(post_save, sender=Comment)
def update_post_popularity_on_save(sender, instance, **kwargs):
    if isinstance(instance, Reaction) or isinstance(instance, Comment):
        post = instance.post
        post.update_popularity()
        post.save()

@receiver(post_delete, sender=Reaction)
@receiver(post_delete, sender=Comment)
def update_post_popularity_on_delete(sender, instance, **kwargs):
    if isinstance(instance, Reaction) or isinstance(instance, Comment):
        post = instance.post
        post.update_popularity()
        post.save()
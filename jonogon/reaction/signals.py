from django.db.models.signals import pre_save, post_save, post_delete
from django.dispatch import receiver
from .models import Reaction, Post

@receiver(pre_save, sender=Reaction)
def save_old_reaction_type(sender, instance, **kwargs):
    if instance.pk:
        # Get the old reaction type before the update
        instance._old_reaction_type = Reaction.objects.get(pk=instance.pk)
    else:
        instance._old_reaction_type = None

@receiver(post_save, sender=Reaction)
def update_engagement_points_on_save(sender, instance, created, **kwargs):
    post = instance.post
    point = instance.point

    if created:
        # If it's a new reaction, simply add the points
        post.engagement_point = post.engagement_point + point
        print(f"Added {point}")
    else:
        # If it's an update, adjust the points based on the difference
        old_points = instance._old_reaction_type.point
        difference = point - old_points
        post.engagement_point = post.engagement_point + difference

    post.save()

@receiver(post_delete, sender=Reaction)
def update_engagement_points_on_delete(sender, instance, **kwargs):
    post = instance.post
    point = instance.point
    post.engagement_point = post.engagement_point - point
    post.save()
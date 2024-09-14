from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Comment
from post.models import Post  # Import your Post model

ENGAGEMENT_POINTS_FOR_NEW_COMMENT = 5  # Define the engagement points for a new comment

@receiver(post_save, sender=Comment)
def increase_post_engagement_on_comment(sender, instance, created, **kwargs):
    if created:
        post = instance.post
        post.engagement_point += ENGAGEMENT_POINTS_FOR_NEW_COMMENT
        post.save()

@receiver(post_delete, sender=Comment)
def decrease_post_engagement_on_comment_delete(sender, instance, **kwargs):
    post = instance.post
    post.engagement_point -= ENGAGEMENT_POINTS_FOR_NEW_COMMENT
    post.save()
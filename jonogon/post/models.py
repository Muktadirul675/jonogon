from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import math

# Create your models here.

POST_STATUS_CHOICES = [
    ('National','National'),
    ('Social','Social'),
    ('Hidden','Hidden'),
    ('Banned','Banned'),
    ('Draft','Draft'),
]

class Topic(models.Model):
    name = models.CharField(max_length=20)

    def __str__(self):
        return self.name
    
class Category(models.Model):
    name = models.CharField(max_length=20)

    def __str__(self):
        return self.name

class Post(models.Model):
    author = models.ForeignKey(User, related_name='posts', on_delete=models.CASCADE)
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=15, choices=POST_STATUS_CHOICES, default="Draft")
    category = models.ForeignKey(Category, related_name='posts', on_delete=models.SET_NULL, null=True)
    topic = models.ForeignKey(Topic, related_name='posts', on_delete=models.SET_NULL, null=True)
    engagement_point = models.FloatField(default=0.0)
    initial_point = models.FloatField(default=100)
    popularity = models.FloatField(default=0.0)  # Add the popularity field

    def calculate_decay_rate(self):
        reputation = self.author.profile.reputation  # Reputation between 0.0 and 1.0
        base_decay_constant = 0.1  # Base decay constant (adjustable)
        engagement_rate = self.engagement_rate()
        decay_rate = base_decay_constant * (1 - reputation) / (engagement_rate + 1)
        return decay_rate

    def engagement_rate(self):
        time_elapsed_seconds = (timezone.now() - self.created_at).total_seconds()
        if time_elapsed_seconds == 0:
            return 0
        return self.engagement_point / time_elapsed_seconds

    def update_popularity(self):
        time_elapsed_seconds = (timezone.now() - self.created_at).total_seconds()
        decay_rate = self.calculate_decay_rate()
        
        # Calculate the engagement rate
        engagement_rate = self.engagement_rate()
        
        # Calculate the score
        increased_score = self.initial_point + engagement_rate * time_elapsed_seconds
        decayed_score = self.initial_point * math.exp(-decay_rate * time_elapsed_seconds)
        
        self.popularity = max(increased_score - decayed_score, 0.0)  # Ensure score does not go below 0

    def save(self, *args, **kwargs):
        # Update the popularity score before saving
        if self.created_at is not None:
            self.update_popularity()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.author}: {self.body[:20]}"

class Share(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='shares')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shares')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} shared {self.post}"

# import math
# from datetime import datetime, timezone

# class Post(models.Model):
#     content = models.TextField()
#     author = models.ForeignKey(User, on_delete=models.CASCADE)
#     timestamp = models.DateTimeField(auto_now_add=True)
#     reactions = models.PositiveIntegerField(default=0)
#     comments = models.PositiveIntegerField(default=0)
#     shares = models.PositiveIntegerField(default=0)

#     MAX_INITIAL_SCORE = 100.0  # Define the maximum initial score

#     def calculate_decay_rate(self):
#         reputation = self.author.profile.reputation  # Reputation between 0.0 and 1.0
#         base_decay_constant = 0.1  # Base decay constant (adjustable)
#         engagement_rate = self.engagement_rate()
#         decay_rate = base_decay_constant * (1 - reputation) / (engagement_rate + 1)
#         return decay_rate

#     def engagement_rate(self):
#         time_elapsed_seconds = (datetime.now(timezone.utc) - self.timestamp).total_seconds()
#         if time_elapsed_seconds == 0:
#             return 0
#         total_points = (self.reactions * 1) + (self.comments * 2) + (self.shares * 3)
#         return total_points / time_elapsed_seconds

#     @property
#     def current_score(self):
#         time_elapsed_seconds = (datetime.now(timezone.utc) - self.timestamp).total_seconds()
#         decay_rate = self.calculate_decay_rate()
        
#         # Calculate the engagement rate
#         engagement_rate = self.engagement_rate()
        
#         # Calculate the score
#         increased_score = self.MAX_INITIAL_SCORE + engagement_rate * time_elapsed_seconds
#         decayed_score = self.MAX_INITIAL_SCORE * math.exp(-decay_rate * time_elapsed_seconds)
        
#         final_score = increased_score - decayed_score
#         return max(final_score, 0.0)  # Ensure score does not go below 0

from rest_framework import serializers
from authentication.serializers import UserProfileDetailsSerializer
from .models import *
from rest_framework.serializers import ModelSerializer, ValidationError

class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class TopicSerializer(ModelSerializer):
    class Meta:
        model = Topic
        fields = '__all__'


class PostSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField()  # Display username instead of user ID
    category = serializers.StringRelatedField()  # Display category name instead of ID
    topic = serializers.StringRelatedField()  # Display topic name instead of ID

    class Meta:
        model = Post
        fields = ['id','body', 'category','topic','author','status']
        read_only_fields = ['author']

    def validate(self, data):
        # Add any additional validation logic if necessary
        return data

class PostDetailsSerializer(serializers.ModelSerializer):
    author = UserProfileDetailsSerializer()
    class Meta:
        model = Post
        fields = "__all__"

class ShareSerializer(ModelSerializer):
    class Meta:
        model = Share
        fields = ['id', 'post', 'user', 'created_at']
        read_only_fields = ['created_at']

    def validate(self, data):
        # Prevent the user from sharing the same post multiple times
        if Share.objects.filter(post=data['post'], user=data['user']).exists():
            raise ValidationError("You have already shared this post.")
        return data

from dj_rest_auth.serializers import UserDetailsSerializer
from rest_framework import serializers
from .models import Profile
from rest_framework.serializers import ModelSerializer
from django.contrib.auth.models import User


class ProfileSerializer(ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'

class UserSerializer(ModelSerializer):
    profile = ProfileSerializer()
    class Meta:
        model = User
        fields = ['username','email', 'first_name','last_name','profile']

class UserProfileDetailsSerializer(ModelSerializer):
    profile = ProfileSerializer()
    class Meta:
        model = User
        fields = ['username','email', 'first_name','last_name', 'profile']

class CustomUserDetailsSerializer(UserDetailsSerializer):
    picture = serializers.ImageField(source='profile.picture')
    bio = serializers.CharField(source='profile.bio')

    class Meta(UserDetailsSerializer.Meta):
        fields = UserDetailsSerializer.Meta.fields + ('picture', 'bio')  # Add your custom fields

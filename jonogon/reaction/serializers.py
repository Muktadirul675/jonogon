from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Reaction, Post

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class ReactionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # Nested serializer for user
    post = serializers.PrimaryKeyRelatedField(queryset=Post.objects.all())

    class Meta:
        model = Reaction
        fields = ['id', 'type', 'created_at', 'updated_at', 'user', 'post']

    def validate(self, data):
        """
        Ensure the user has not already reacted to the post.
        """
        view = self.context.get('view')
        action = getattr(view, 'action', None)

        if action == 'create':
            user = self.context['request'].user
            post = data['post']
            reaction = None

            if Reaction.objects.filter(user=user, post=post).exists():
                reaction = Reaction.objects.get(user=user, post=post)
                type = self.context.get('request').data.get('type')
                if type == reaction.type:
                    raise serializers.ValidationError(f"You have already reacted {type} to this post.")

        return data

    def create(self, validated_data):
        user = self.context.get('request').user
        validated_data['user'] = user  # Automatically set the user from the request
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        user = self.context.get('request').user
        if user != instance.user:
            raise serializers.ValidationError("You do not have permission to update this reaction.")
        return super().update(instance, validated_data)
    
    
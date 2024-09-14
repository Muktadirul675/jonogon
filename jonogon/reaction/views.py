from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Reaction
from post.models import Post
from .serializers import ReactionSerializer
from rest_framework.permissions import BasePermission, SAFE_METHODS
from rest_framework.response import Response
from rest_framework import status

class IsReactorOrReadonly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        if obj.user.username == request.user.username:
            return True
        return False

class ReactionViewSet(viewsets.ModelViewSet):
    serializer_class = ReactionSerializer
    permission_classes = [IsAuthenticated, IsReactorOrReadonly]

    def get_queryset(self):
        post_id = self.request.query_params.get('post', None)
        user = self.request.user

        if self.action in ['list', 'retrieve']:
            # Return reactions specific to a post
            if post_id is not None:
                return Reaction.objects.filter(post_id=post_id)
            return Reaction.objects.none()

        # For create, update, delete actions, return user-specific reactions for a post
        if post_id is not None:
            return Reaction.objects.filter(post_id=post_id, user=user)
        
        return Reaction.objects.none()

    def perform_create(self, serializer):
        data = self.request.data
        user = self.request.user
        post = Post.objects.get(id=data.get('post'))
        # print('creating...')
        if Reaction.objects.filter(post=post, user=user).exists():
            # print('updating...')
            instance = Reaction.objects.get(post=post, user=user)
            update_serializer = self.get_serializer(instance=instance, data=data, partial=False)
            update_serializer.is_valid(raise_exception=True)
            self.perform_update(update_serializer)
            # print('updated')
            return Response(update_serializer.data, status=status.HTTP_200_OK)
        serializer.save(user=self.request.user)
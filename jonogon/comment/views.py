from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from .models import Comment
from rest_framework.permissions import BasePermission, SAFE_METHODS
from rest_framework.response import Response
from .serializers import CommentSerializer

class IsCommentorOrReadonly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        if obj.user.username == request.user.username:
            return True
        return False

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated, IsCommentorOrReadonly]

    def get_queryset(self):
        post_id = self.request.query_params.get('post', None)
        if post_id is not None:
            if self.action in ['list']:
                return Comment.objects.filter(post_id=post_id, parent__isnull=True)
            else:
                return Comment.objects.filter(post_id=post_id)

        return Comment.objects.none()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(methods=['get'], detail=False)
    def count(self,request):
        post_id = self.request.query_params.get('post', None)
        if post_id is None:
            return Response(None)
        return Response(Comment.objects.filter(post_id=post_id).count())
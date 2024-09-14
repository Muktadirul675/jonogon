from rest_framework import viewsets, permissions
from .models import *
from rest_framework.response import Response
from .serializers import ShareSerializer, PostSerializer
from django.http import JsonResponse
from django.contrib.auth.models import User
import random
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Post
from .serializers import *
from rest_framework import permissions, viewsets
from rest_framework.pagination import PageNumberPagination

# Create your views here.

texts = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus at velit id fringilla. Donec sit amet diam ac massa fermentum dapibus. Vivamus et velit molestie sem bibendum ultricies. Sed at ultrices ante, quis porttitor ligula. Nunc ac purus volutpat, euismod leo sed, facilisis purus. Nunc eget fermentum leo. Nulla facilisi. Quisque eu ante ac libero lobortis pulvinar sit amet et enim. Pellentesque volutpat tristique mauris id mattis. Nam maximus ex sed nibh consectetur interdum. Maecenas molestie purus odio, vel accumsan risus venenatis eget. Vestibulum aliquet fermentum ipsum et malesuada.",
    "Mauris porta euismod nunc, sed volutpat sem maximus vitae. Quisque consectetur ex quis felis malesuada luctus. Aenean ultrices dignissim metus. Sed sollicitudin vitae nunc eget sodales. Nunc vitae commodo sapien. Aliquam erat volutpat. Vivamus imperdiet magna arcu, eget eleifend justo faucibus nec. Duis et metus mi. Aenean consectetur est at ante tincidunt facilisis.",
    "Nullam in ultrices nulla. Proin eu erat posuere sapien hendrerit cursus. Pellentesque sem mauris, dictum sit amet ligula condimentum, porttitor fermentum justo. Ut faucibus, orci semper ornare euismod, eros lorem eleifend magna, in gravida nibh sem sit amet diam. Phasellus sagittis tincidunt tincidunt. Aliquam erat volutpat. Curabitur in rhoncus ipsum. Proin placerat tellus sit amet risus sagittis scelerisque. Maecenas tincidunt arcu sit amet enim condimentum, sed cursus magna rhoncus. Nulla luctus nisi pretium, pulvinar risus tincidunt, vehicula metus. Nunc vel cursus nulla. Morbi dictum scelerisque nisl, tempus egestas turpis lacinia ut. Phasellus at faucibus elit, a pretium enim.",
    "Morbi vehicula augue a suscipit auctor. Nunc rutrum nisl metus, quis tristique mauris mattis eu. Pellentesque nunc felis, molestie condimentum lacus id, interdum euismod neque. Maecenas bibendum turpis vel ipsum faucibus efficitur. Mauris varius maximus pellentesque. Sed maximus dui tristique nulla feugiat, non viverra nibh consectetur. Pellentesque eget magna risus. Ut id mauris et lectus posuere blandit. In sed interdum risus. Donec suscipit ultrices risus, a ullamcorper turpis. Cras blandit pharetra magna sit amet dignissim. Aliquam lobortis sollicitudin ultricies. Donec maximus sit amet nibh ac accumsan. Sed dapibus sollicitudin dui ac suscipit.",
    "In hac habitasse platea dictumst. Cras libero libero, elementum sed purus et, bibendum egestas nunc. Proin vel euismod nunc. In eros metus, varius id semper at, tincidunt vel elit. Phasellus ut interdum neque. Curabitur eget porttitor nulla, eget molestie enim. Ut nec tortor ac augue semper feugiat a a ligula. Integer sagittis accumsan urna, eu congue tortor malesuada a. Nulla facilisi. Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras at porttitor nulla."
]

def populate(request):
    user = User.objects.get(username='mahi')
    for i in range(100):
        body = random.choice(texts)
        post = Post(author=user, body=body)
        post.save()
    return JsonResponse({'message':'populated'})


class IsRoleBasedPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        # Allow access to authenticated users only
        if not request.user.is_authenticated:
            return False
        
        # Allow create if user is in allowed roles
        if view.action == 'create':
            return request.user.groups.filter(name__in=['Writer', 'Reporter', 'Content Creator']).exists()
        
        # Allow read access to all authenticated users
        if view.action in ['list', 'retrieve']:
            return True
        
        return False

    def has_object_permission(self, request, view, obj):
        # Allow update and delete if user is the author
        print(request.user.username,obj.author.username,request.user.username == obj.author.username)
        if self.action in ['update', 'destroy','partial_update']:
            print(request.user.username,obj.author.username,request.user.username == obj.author.username)
            return request.user.username == obj.author.username
        
        return True
    
class IsAuthor(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if obj.author.username == request.user.username:
            return True
        return False

class HomePagePostPaginator(PageNumberPagination):
    page_size = 30

class PostViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = HomePagePostPaginator

    def get_permissions(self):
        if self.action in ['update','partial_update','destroy','profile_post']:
            return [permissions.IsAuthenticated(), IsAuthor()]
        return super().get_permissions()

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return PostDetailsSerializer
        return PostSerializer

    def get_queryset(self):
        # Fetch posts ordered by popularity
        if self.action in ['list','retrieve']:
            return Post.objects.filter(status="Public").order_by('-popularity')
        else:
            return Post.objects.all().order_by('-popularity')

    def perform_create(self, serializer):
        if not self.request.user.groups.filter(name__in=['Writer', 'Reporter', 'Content Creator']).exists():
            raise PermissionDenied("Only Writers, Reporters, and Content Creators can create posts.")
        serializer.save(author=self.request.user)

    def update(self, request, *args, **kwargs):
        post = self.get_object()
        if post.author.username != request.user.username:
            raise PermissionDenied("You do not have permission to update this post.")
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        post = self.get_object()
        if post.author.username != request.user.username:
            raise PermissionDenied("You do not have permission to delete this post.")
        return super().destroy(request, *args, **kwargs)
    
    @action(detail=False, methods=['get'])
    def drafts(self, request, *args, **kwargs):
        posts = Post.objects.filter(author=self.request.user, status="Draft")
        data = PostDetailsSerializer(posts,many=True, context={'request':request}).data
        return Response(data)
        
    @action(detail=False, methods=['get'])
    def profile_posts(self, request, *args, **kwargs):
        posts = Post.objects.filter(author=self.request.user, status="Public")
        data = PostDetailsSerializer(posts,many=True, context={'request':request}).data
        return Response(data)
    
    @action(detail=True, methods=['get'])
    def profile_post(self, request,pk , *args, **kwargs):
        posts = Post.objects.get(id=pk)
        data = PostDetailsSerializer(posts,many=False, context={'request':request}).data
        return Response(data)
        

class ShareViewSet(viewsets.ModelViewSet):
    queryset = Share.objects.all()
    serializer_class = ShareSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Filter shares by the post if a post ID is provided
        post_id = self.request.query_params.get('post_id')
        if post_id:
            return self.queryset.filter(post_id=post_id)
        return self.queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

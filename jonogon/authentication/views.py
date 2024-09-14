from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client, OAuth2Error
import jwt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Profile
from .serializers import ProfileSerializer


class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    def save_user(self, request, sociallogin, form=None):
        user = super().save_user(request, sociallogin, form)
        if sociallogin.account.provider == 'google':
            extra_data = sociallogin.account.extra_data
            user.avatar = extra_data.get('picture')
            user.save()
        return user

class CustomGoogleOAuth2Adapter(GoogleOAuth2Adapter):
    def complete_login(self, request, app, token, response, **kwargs):
        # print("============================")
        # print(response['id_token'])
        # print("============================")
        try:
            identity_data = jwt.decode(
                response["id_token"], #another nested id_token was returned
                options={
                    "verify_signature": False,
                    "verify_iss": True,
                    "verify_aud": True,
                    "verify_exp": True,
                },
                issuer=self.id_token_issuer,
                audience=app.client_id,
            )
        except jwt.PyJWTError as e:
            raise OAuth2Error("Invalid id_token") from e
        login = self.get_provider().sociallogin_from_response(request, identity_data)
        return login

class GoogleLogin(SocialLoginView):
    adapter_class = CustomGoogleOAuth2Adapter
    callback_url = "http://localhost:3000/api/auth/callback/google"
    client_class = OAuth2Client

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        profile = Profile.objects.get(user=request.user)
        serializer = ProfileSerializer(profile)

        return Response(serializer.data)


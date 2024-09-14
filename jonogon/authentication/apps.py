from django.apps import AppConfig


class AuthenticationConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'authentication'

    def ready(self) -> None:
        import authentication.signals


# from django.apps import AppConfig

# class ActivityAppConfig(AppConfig):
#     name = 'activity'

#     def ready(self):
#         import activity.signals

from django.apps import AppConfig


class ReactionConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'reaction'

    def ready(self) -> None:
        import reaction.signals

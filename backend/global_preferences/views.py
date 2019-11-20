from dynamic_preferences.api.viewsets import GlobalPreferencesViewSet

from .serializers import CustomGlobalPreferenceSerializer


class CustomGlobalPreferencesViewSet(GlobalPreferencesViewSet):
    serializer_class = CustomGlobalPreferenceSerializer
    permission_classes = []

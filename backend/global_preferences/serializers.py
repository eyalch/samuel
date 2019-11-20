from dynamic_preferences.api.serializers import PreferenceValueField
from rest_framework import serializers


class CustomGlobalPreferenceSerializer(serializers.Serializer):
    key = serializers.CharField(source="name")
    value = PreferenceValueField()

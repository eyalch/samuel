from rest_framework import serializers

from .models import User


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ("name", "email", "stated_health_today")

    def get_name(self, user):
        return user.get_full_name()

from rest_framework import serializers

from .models import Dish


class DishSerializer(serializers.ModelSerializer):
    did_user_order_today = serializers.SerializerMethodField()

    class Meta:
        model = Dish
        fields = ["id", "name", "description", "image", "did_user_order_today"]

    def get_did_user_order_today(self, dish):
        user = self.context["request"].user
        if user.is_authenticated:
            return user.did_order_dish_today(dish)
        return False

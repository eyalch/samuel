from rest_framework import serializers

from .models import Dish


class DishSerializer(serializers.ModelSerializer):
    did_user_order_today = serializers.SerializerMethodField()

    user_todays_orders = None

    class Meta:
        model = Dish
        fields = ["id", "name", "description", "image", "did_user_order_today"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        user = self.context["request"].user
        if user.is_authenticated:
            self.user_todays_orders = user.list_todays_orders()

    def get_did_user_order_today(self, dish):
        if self.user_todays_orders is None:
            return False

        return self.user_todays_orders.filter(dish=dish).count() > 0

from rest_framework import serializers

from .models import Dish, Order


class DishSerializer(serializers.ModelSerializer):
    orders_count = serializers.SerializerMethodField()

    user_todays_orders = Order.objects.none()

    class Meta:
        model = Dish
        fields = ["id", "name", "description", "image", "orders_count"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        user = self.context["request"].user
        if user.is_authenticated:
            self.user_todays_orders = user.list_todays_orders()

    def get_orders_count(self, dish):
        return self.user_todays_orders.filter(dish=dish).count()

from django.utils import timezone
from rest_framework import serializers

from .errors import TimeIsUpError
from .models import Dish, Order, ScheduledDish
from .views import check_if_time_is_up_for_today


class DishSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dish
        fields = ("name", "description", "image")


class ScheduledDishSerializer(serializers.ModelSerializer):
    dish = DishSerializer()
    orders_count = serializers.SerializerMethodField()
    has_dishes_left = serializers.SerializerMethodField()

    user_future_orders = Order.objects.none()

    class Meta:
        model = ScheduledDish
        fields = ("id", "date", "orders_count", "dish", "has_dishes_left")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        user = self.context["request"].user
        if user.is_authenticated:
            self.user_future_orders = Order.objects.filter(
                user=user, scheduled_dish__date__gte=timezone.now().date()
            )

    def get_orders_count(self, scheduled_dish):
        return self.user_future_orders.filter(scheduled_dish=scheduled_dish).count()

    def get_has_dishes_left(self, scheduled_dish):
        if scheduled_dish.orders_left is None:
            try:
                check_if_time_is_up_for_today()
                return True
            except TimeIsUpError:
                return False

        if scheduled_dish.orders_left > 0:
            return True

        return False

    def to_representation(self, instance):
        """Flatten dish's properties"""
        representation = super().to_representation(instance)

        dish_representation = representation.pop("dish")
        for key in dish_representation:
            representation[key] = dish_representation[key]

        return representation

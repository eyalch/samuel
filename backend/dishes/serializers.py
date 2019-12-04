from django.utils import timezone
from rest_framework import serializers

from .models import Dish, Order, ScheduledDish


class DishSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dish
        fields = ("name", "description", "image")


class ScheduledDishSerializer(serializers.ModelSerializer):
    dish = DishSerializer()
    orders_count = serializers.SerializerMethodField()

    user_future_orders = Order.objects.none()

    class Meta:
        model = ScheduledDish
        fields = ("id", "date", "orders_count", "dish")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        user = self.context["request"].user
        if user.is_authenticated:
            self.user_future_orders = Order.objects.filter(
                user=user, created_at__date__gte=timezone.now().date()
            )

    def get_orders_count(self, scheduled_dish):
        return self.user_future_orders.filter(scheduled_dish=scheduled_dish).count()

    def to_representation(self, instance):
        """Flatten dish's properties"""
        representation = super().to_representation(instance)

        dish_representation = representation.pop("dish")
        for key in dish_representation:
            representation[key] = dish_representation[key]

        return representation

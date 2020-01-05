import datetime

from django.utils import timezone
from dynamic_preferences.registries import global_preferences_registry
from rest_framework import exceptions, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .errors import MaxOrdersForDayError, NoDishesLeftError
from .helpers import check_if_time_is_up_for_today
from .models import Order, ScheduledDish
from .serializers import ScheduledDishSerializer

global_preferences = global_preferences_registry.manager()


class ScheduledDishViewSet(viewsets.mixins.ListModelMixin, viewsets.GenericViewSet):
    serializer_class = ScheduledDishSerializer

    def get_queryset(self):
        """
        Return dishes for today and tomorrow
        """
        today = timezone.now().date()
        tomorrow = today + datetime.timedelta(days=1)

        return ScheduledDish.objects.filter(date__gte=today, date__lte=tomorrow)

    @action(methods=["POST"], detail=True, permission_classes=[IsAuthenticated])
    def order(self, request, pk=None):
        scheduled_dish = self.get_object()

        today = timezone.now().date()

        # If there's an order limit, don't check if time is up
        if scheduled_dish.orders_left is not None:
            # Check whether there are dishes left
            if scheduled_dish.orders_left <= 0:
                raise NoDishesLeftError()
        elif scheduled_dish.date == today:
            check_if_time_is_up_for_today()

        # Check whether the user has ordered the maximum allowed dishes for the day
        max_orders_per_day = global_preferences["max_orders_per_day"]
        user_orders_count_for_the_day = Order.objects.filter(
            user=request.user, scheduled_dish__date=scheduled_dish.date
        ).count()
        if user_orders_count_for_the_day == max_orders_per_day:
            raise MaxOrdersForDayError()

        # Create a new order and update the scheduled dish
        Order.objects.create(user=request.user, scheduled_dish=scheduled_dish)
        scheduled_dish.refresh_from_db()

        serializer = self.get_serializer(scheduled_dish)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @order.mapping.delete
    def delete_order(self, request, pk=None):
        scheduled_dish = self.get_object()

        today = timezone.now().date()
        if scheduled_dish.date == today:
            check_if_time_is_up_for_today()

        order = Order.objects.filter(
            user=request.user, scheduled_dish=scheduled_dish
        ).last()

        # Make sure an order exists for the given scheduled dish
        if order is None:
            raise exceptions.NotFound()

        # Delete the order and update the scheduled dish
        order.delete()
        scheduled_dish.refresh_from_db()

        serializer = self.get_serializer(scheduled_dish)

        return Response(serializer.data, status=status.HTTP_200_OK)

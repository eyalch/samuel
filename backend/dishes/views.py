import datetime

from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from dynamic_preferences.registries import global_preferences_registry
from rest_framework import exceptions, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Order, ScheduledDish
from .serializers import ScheduledDishSerializer

global_preferences = global_preferences_registry.manager()


class TimeIsUpError(exceptions.APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _("Time for today is up.")
    code = "time_is_up"


class MaxOrdersError(exceptions.APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _(
        "User has already made the maximum amount of orders for a single day."
    )
    code = "max_orders"


def check_if_time_is_up():
    """
    Check if there's time left for orders; raise an error if not
    """
    now = timezone.now()
    allow_orders_until_time = global_preferences["allow_orders_until"]
    allow_orders_until = now.replace(
        hour=allow_orders_until_time.hour,
        minute=allow_orders_until_time.minute,
        second=allow_orders_until_time.second,
    )
    if now > allow_orders_until:
        raise TimeIsUpError()


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
        if scheduled_dish.date == today:
            check_if_time_is_up()

        # Check whether the user has ordered the maximum allowed dishes for the day
        max_orders_per_day = global_preferences["max_orders_per_day"]
        user_orders_count_for_the_day = Order.objects.filter(
            user=request.user, scheduled_dish__date=scheduled_dish.date
        ).count()
        if user_orders_count_for_the_day == max_orders_per_day:
            raise MaxOrdersError()

        # Create a new order
        Order.objects.create(user=request.user, scheduled_dish=scheduled_dish)

        serializer = self.get_serializer(scheduled_dish)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @order.mapping.delete
    def delete_order(self, request, pk=None):
        scheduled_dish = self.get_object()

        today = timezone.now().date()
        if scheduled_dish.date == today:
            check_if_time_is_up()

        order = Order.objects.filter(
            user=request.user, scheduled_dish=scheduled_dish
        ).last()

        # Make sure an order exists for the given scheduled dish
        if order is None:
            raise exceptions.NotFound()

        order.delete()

        serializer = self.get_serializer(scheduled_dish)

        return Response(serializer.data, status=status.HTTP_200_OK)

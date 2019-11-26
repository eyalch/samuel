from django.shortcuts import get_list_or_404
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from dynamic_preferences.registries import global_preferences_registry
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import APIException
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Dish, Order
from .serializers import DishSerializer

global_preferences = global_preferences_registry.manager()


class TimeIsUpError(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _("Time for today is up.")
    code = "time_is_up"


class MaxOrdersError(APIException):
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


class DishViewSet(viewsets.mixins.ListModelMixin, viewsets.GenericViewSet):
    serializer_class = DishSerializer

    def get_queryset(self):
        return Dish.objects.filter(next_date__date=timezone.now())

    @action(methods=["POST"], detail=True, permission_classes=[IsAuthenticated])
    def order(self, request, pk=None):
        check_if_time_is_up()

        # Check if user has already ordered the maximum allowed dishes for a single day
        max_orders_per_day = global_preferences["max_orders_per_day"]
        if request.user.list_todays_orders().count() == max_orders_per_day:
            raise MaxOrdersError()

        dish = self.get_object()

        # Create a new order
        Order(user=request.user, dish=dish).save()

        return Response(status=status.HTTP_201_CREATED)

    @order.mapping.delete
    def delete_order(self, request, pk=None):
        check_if_time_is_up()

        dish = self.get_object()

        user_orders_for_today = get_list_or_404(
            request.user.list_todays_orders(), dish=dish
        )

        # Delete the last order of the dish
        user_orders_for_today[-1].delete()

        return Response(status=status.HTTP_204_NO_CONTENT)

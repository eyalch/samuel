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


class OrdersTimeIsUpError(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _("Time for orders today is up.")
    code = "orders_time_is_up"


class DishViewSet(viewsets.mixins.ListModelMixin, viewsets.GenericViewSet):
    serializer_class = DishSerializer

    def get_queryset(self):
        return Dish.objects.filter(next_date__date=timezone.now())

    @action(methods=["POST"], detail=True, permission_classes=[IsAuthenticated])
    def order(self, request, pk=None):
        allow_orders_until_time = global_preferences["allow_orders_until"]
        now = timezone.now()
        allow_orders_until = now.replace(
            hour=allow_orders_until_time.hour,
            minute=allow_orders_until_time.minute,
            second=allow_orders_until_time.second,
        )
        if now > allow_orders_until:
            raise OrdersTimeIsUpError()

        dish = self.get_object()

        # Delete current users' orders for today
        today = timezone.now()
        Order.objects.filter(user=request.user, created_at__date=today).delete()

        # Create a new order
        Order(user=request.user, dish=dish).save()

        return Response(status=status.HTTP_201_CREATED)

from datetime import datetime

from django.utils.translation import gettext_lazy as _
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.exceptions import APIException
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .serializers import DishSerializer
from .models import Dish, Order


class AlreadyOrderedTodayError(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    detail = _(
        "User has already made an order today. "
        "To order a different dish, cancel the current order."
    )
    code = "already_ordered_today"


class DishViewSet(viewsets.mixins.ListModelMixin, viewsets.GenericViewSet):
    serializer_class = DishSerializer

    def get_queryset(self):
        return Dish.objects.filter(next_date__date=datetime.today())

    @action(methods=["POST"], detail=True, permission_classes=[IsAuthenticated])
    def order(self, request, pk=None):
        if request.user.did_order_today():
            raise AlreadyOrderedTodayError()

        dish = self.get_object()

        new_order = Order(user=request.user, dish=dish)
        new_order.save()

        return Response(status=status.HTTP_201_CREATED)

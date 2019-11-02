from datetime import datetime

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .serializers import DishSerializer
from .models import Dish, Order


class DishViewSet(viewsets.mixins.ListModelMixin, viewsets.GenericViewSet):
    serializer_class = DishSerializer

    def get_queryset(self):
        return Dish.objects.filter(next_date__date=datetime.today())

    @action(methods=["POST"], detail=True, permission_classes=[IsAuthenticated])
    def order(self, request, pk=None):
        dish = self.get_object()

        # Delete current users' orders for today
        today = datetime.today()
        Order.objects.filter(user=request.user, created_at__date=today).delete()

        # Create a new order
        Order(user=request.user, dish=dish).save()

        return Response(status=status.HTTP_201_CREATED)

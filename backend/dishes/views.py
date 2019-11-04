from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Dish, Order
from .serializers import DishSerializer


class DishViewSet(viewsets.mixins.ListModelMixin, viewsets.GenericViewSet):
    serializer_class = DishSerializer

    def get_queryset(self):
        return Dish.objects.filter(next_date__date=timezone.now())

    @action(methods=["POST"], detail=True, permission_classes=[IsAuthenticated])
    def order(self, request, pk=None):
        dish = self.get_object()

        # Delete current users' orders for today
        today = timezone.now()
        Order.objects.filter(user=request.user, created_at__date=today).delete()

        # Create a new order
        Order(user=request.user, dish=dish).save()

        return Response(status=status.HTTP_201_CREATED)

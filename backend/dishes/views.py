from datetime import datetime

from rest_framework import viewsets

from .serializers import DishSerializer
from .models import Dish


class DishViewSet(viewsets.mixins.ListModelMixin, viewsets.GenericViewSet):
    serializer_class = DishSerializer

    def get_queryset(self):
        return Dish.objects.filter(next_date__date=datetime.today())

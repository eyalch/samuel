from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .serializers import UserSerializer


class UsersViewSet(viewsets.GenericViewSet):
    serializer_class = UserSerializer

    @action(methods=["GET"], detail=False, permission_classes=[IsAuthenticated])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

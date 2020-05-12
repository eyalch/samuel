from django.utils.translation import gettext_lazy as _
from rest_framework import exceptions, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import HealthStatement


class AlreadyStatedError(exceptions.APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _("User has already stated their health for today.")
    code = "already_stated"


class HealthStatementViewSet(viewsets.mixins.CreateModelMixin, viewsets.GenericViewSet):
    @action(methods=["POST"], detail=False, permission_classes=[IsAuthenticated])
    def state_health(self, request):
        if request.user.stated_health_today:
            raise AlreadyStatedError()

        HealthStatement.objects.create(user=request.user)

        return Response(status=status.HTTP_201_CREATED)

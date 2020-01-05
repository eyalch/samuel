from django.utils.translation import gettext_lazy as _
from rest_framework import exceptions, status


class TimeIsUpError(exceptions.APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _("Time for today is up.")
    code = "time_is_up"


class MaxOrdersForDayError(exceptions.APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _(
        "User has already made the maximum amount of orders for a single day."
    )
    code = "max_orders_for_day"


class NoDishesLeftError(exceptions.APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = _("No more dishes left for the day.")
    code = "no_dishes_left"

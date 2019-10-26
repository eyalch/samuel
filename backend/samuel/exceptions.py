from rest_framework import exceptions
from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None and isinstance(exc, exceptions.APIException):
        if "code" not in response.data:
            code = getattr(exc, "code", exc.default_code)
            response.data["code"] = code

    return response

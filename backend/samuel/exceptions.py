from rest_framework import exceptions
from rollbar.contrib.django_rest_framework import post_exception_handler


def custom_exception_handler(exc, context):
    """
    For exceptions which subclass APIException, extracts the `code` or `default_code`
    properties and adds a `code` field to the response with the value.
    """
    response = post_exception_handler(exc, context)

    if response is not None and isinstance(exc, exceptions.APIException):
        if "code" not in response.data:
            code = getattr(exc, "code", exc.default_code)
            response.data["code"] = code

    return response

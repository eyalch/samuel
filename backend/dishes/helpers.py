from django.utils import timezone
from dynamic_preferences.registries import global_preferences_registry

from .errors import TimeIsUpError

global_preferences = global_preferences_registry.manager()


def check_if_time_is_up_for_today():
    """
    Check if there's time left to order today; raise an error if not
    """
    now = timezone.now()
    allow_orders_until_time = global_preferences["allow_orders_until"]
    allow_orders_until = now.replace(
        hour=allow_orders_until_time.hour,
        minute=allow_orders_until_time.minute,
        second=allow_orders_until_time.second,
    )
    if now > allow_orders_until:
        raise TimeIsUpError()

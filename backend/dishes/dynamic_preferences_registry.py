from datetime import time

from dynamic_preferences.types import TimePreference, IntegerPreference
from dynamic_preferences.registries import global_preferences_registry


@global_preferences_registry.register
class AllowOrdersUntil(TimePreference):
    name = "allow_orders_until"
    default = time.fromisoformat("11:00")


@global_preferences_registry.register
class MaxOrdersPerDay(IntegerPreference):
    name = "max_orders_per_day"
    default = 3

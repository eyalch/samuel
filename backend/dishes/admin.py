from django.contrib import admin
from django.utils import timezone

from .models import Dish, Order


@admin.register(Dish)
class DishAdmin(admin.ModelAdmin):
    list_display = ("name", "description", "next_date", "image")
    actions = ["mark_for_today"]

    def mark_for_today(self, request, queryset):
        today = timezone.now()

        # Iterate through the selected dished and update only the date
        # (while keeping the original time)
        for dish in queryset:
            dish.next_date = dish.next_date.replace(
                year=today.year, month=today.month, day=today.day
            )
            dish.save()

        rows_updated = len(queryset)
        if rows_updated == 1:
            message_bit = "1 dish was"
        else:
            message_bit = f"{rows_updated} dishes were"
        self.message_user(request, f"{message_bit} marked for today.")

    mark_for_today.short_description = "Mark selected dishes for today"


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("dish", "created_at")
    list_filter = ("created_at", "dish")

    def has_add_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

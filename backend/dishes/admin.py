from django.contrib import admin

from .models import Dish, Order


@admin.register(Dish)
class DishAdmin(admin.ModelAdmin):
    list_display = ("name", "description", "next_date", "image")


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

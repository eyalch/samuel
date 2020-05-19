from django.contrib import admin

from .models import HealthStatement


@admin.register(HealthStatement)
class HealthStatementAdmin(admin.ModelAdmin):
    list_display = ("user", "date")
    list_display_links = None

    def has_add_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return False

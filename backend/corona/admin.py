from django.contrib import admin

from .models import HealthStatement


@admin.register(HealthStatement)
class HealthStatementAdmin(admin.ModelAdmin):
    list_display = ("user", "get_user_domain", "date")
    list_display_links = None
    list_filter = ("user__domain",)

    def get_user_domain(self, obj):
        return obj.user.domain

    get_user_domain.short_description = "Domain"

    def has_add_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return False

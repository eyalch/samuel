import datetime

from django import forms
from django.contrib import admin
from django.utils import timezone

from .models import Dish, Order, ScheduledDish


class DishAdminForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Make the "name" and "description" fields RTL
        self.fields["name"].widget.attrs.update({"style": "direction: rtl"})
        self.fields["description"].widget.attrs.update({"style": "direction: rtl"})


class AddScheduledDishInline(admin.TabularInline):
    model = ScheduledDish
    max_num = 1
    can_delete = False
    verbose_name_plural = "new scheduled dish"

    def has_view_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return False


class ScheduledDishInline(admin.TabularInline):
    model = ScheduledDish
    readonly_fields = ("date",)
    extra = 0
    can_delete = False
    show_change_link = True

    def has_add_permission(self, request, obj=None):
        return False


@admin.register(Dish)
class DishAdmin(admin.ModelAdmin):
    list_display = ("name", "description", "image")
    actions = ["schedule_for_today", "schedule_for_tomorrow"]
    form = DishAdminForm
    inlines = [AddScheduledDishInline, ScheduledDishInline]

    def schedule_for(self, dishes, date, request):
        """Create a ScheduledDish for today for each dish"""

        scheduled_dishes_created = 0

        for dish in dishes:
            _, created = ScheduledDish.objects.get_or_create(dish=dish, date=date)
            if created:
                scheduled_dishes_created += 1

        if scheduled_dishes_created == 1:
            message_bit = "1 dish was"
        else:
            message_bit = f"{scheduled_dishes_created} dishes were"
        self.message_user(request, f"{message_bit} scheduled for today.")

    def schedule_for_today(self, request, queryset):
        today = timezone.now().date()
        self.schedule_for(queryset, today, request)

    schedule_for_today.short_description = "Schedule for today"

    def schedule_for_tomorrow(self, request, queryset):
        tomorrow = timezone.now().date() + datetime.timedelta(days=1)
        self.schedule_for(queryset, tomorrow, request)

    schedule_for_tomorrow.short_description = "Schedule for tomorrow"


@admin.register(ScheduledDish)
class ScheduledDishAdmin(admin.ModelAdmin):
    list_display = ("dish", "date")
    ordering = ("-date",)
    list_filter = ("dish", "date")


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("scheduled_dish", "created_at")
    list_filter = ("scheduled_dish",)
    list_display_links = None
    ordering = ("-scheduled_dish__date",)
    actions = None  # Disable the "Delete selected" action

    def has_add_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return False

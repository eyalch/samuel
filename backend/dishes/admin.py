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
    actions = ["schedule_for_today"]
    form = DishAdminForm
    inlines = [AddScheduledDishInline, ScheduledDishInline]

    def schedule_for_today(self, request, queryset):
        scheduled_dishes_created = 0

        # Iterate over the selected dishes and create a scheduled dish for each one
        for dish in queryset:
            _, created = ScheduledDish.objects.get_or_create(
                dish=dish, date=timezone.now().date()
            )
            if created:
                scheduled_dishes_created += 1

        if scheduled_dishes_created == 1:
            message_bit = "1 dish was"
        else:
            message_bit = f"{scheduled_dishes_created} dishes were"
        self.message_user(request, f"{message_bit} scheduled for today.")

    schedule_for_today.short_description = "Schedule selected dishes for today"


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

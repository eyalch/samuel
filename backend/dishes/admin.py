import datetime

from babel.dates import format_date
from django import forms
from django.conf import settings
from django.contrib import admin, messages
from django.core.mail import send_mail
from django.http import HttpResponseRedirect
from django.template.loader import get_template
from django.urls import path
from django.utils import timezone

from .errors import TimeIsUpError
from .models import Dish, Order, ScheduledDish
from .views import check_if_time_is_up_for_today

plaintext_template = get_template("email/daily_dishes.txt")
html_template = get_template("email/daily_dishes.html")


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
    exclude = ("orders_left",)

    def has_view_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return False


@admin.register(Dish)
class DishAdmin(admin.ModelAdmin):
    list_display = ("name", "description", "image")
    actions = ["schedule_for_today", "schedule_for_tomorrow"]
    form = DishAdminForm
    inlines = [AddScheduledDishInline]
    change_list_template = "admin/dishes_changelist.html"
    actions_on_bottom = True
    radio_fields = {"dish_type": admin.VERTICAL}
    search_fields = ["name"]
    ordering = ["name"]

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

    def get_urls(self):
        urls = super().get_urls()
        my_urls = [
            path("send_email/", self.send_email),
            path("send_email_test/", self.send_email, {"test": True}),
        ]
        return my_urls + urls

    def send_email(self, request, test=False):
        """
        Send an email with today's dishes. If the time is up for today, then send
        tomorrow's dishes. The email will be sent only if there are scheduled dishes.
        """
        date = timezone.now().date()
        try:
            check_if_time_is_up_for_today()
        except TimeIsUpError:
            date += datetime.timedelta(days=1)

        scheduled_dishes = ScheduledDish.objects.filter(date=date)

        if len(scheduled_dishes) == 0:
            self.message_user(
                request, "No scheduled dishes. Not sending an email.", messages.WARNING
            )
            return HttpResponseRedirect("../")

        dishes = [scheduled_dish.dish for scheduled_dish in scheduled_dishes]
        context = {
            "dishes": dishes,
            "base_url": settings.BASE_URL,
            "weekday": format_date(date, "EEE", locale="he"),
            "date": format_date(date, "d בMMMM", locale="he"),
            "test": test,
        }

        send_mail(
            "סמואל",
            plaintext_template.render(context),
            settings.DEFAULT_FROM_EMAIL,
            settings.EMAIL_TEST_RECIPIENTS if test else settings.EMAIL_RECIPIENTS,
            html_message=html_template.render(context),
        )

        self.message_user(request, "Successfully sent an email.", messages.SUCCESS)
        return HttpResponseRedirect("../")


@admin.register(ScheduledDish)
class ScheduledDishAdmin(admin.ModelAdmin):
    list_display = ("__str__", "orders_left")
    ordering = ("-date",)
    list_filter = ("dish", "date")
    date_hierarchy = "date"
    autocomplete_fields = ["dish"]


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("scheduled_dish", "created_at")
    list_filter = ("created_at", "scheduled_dish")
    list_display_links = None
    ordering = ("-scheduled_dish__date",)
    actions = None  # Disable the "Delete selected" action
    date_hierarchy = "created_at"

    def has_add_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return False

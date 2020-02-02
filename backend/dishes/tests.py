import datetime

from django.db.utils import IntegrityError
from django.urls import reverse
from django.utils import timezone
from dynamic_preferences.registries import global_preferences_registry
from rest_framework import status
from rest_framework.test import APITestCase

from users.models import User

from .models import Dish, ScheduledDish
from .views import MaxOrdersForDayError, NoDishesLeftError


class TestCaseMixin:
    @classmethod
    def setUpTestData(cls):
        cls.today = timezone.now().date()
        cls.tomorrow = cls.today + datetime.timedelta(days=1)

        cls.global_preferences = global_preferences_registry.manager()
        cls.global_preferences["allow_orders_until"] = datetime.time.max


class DishesTests(TestCaseMixin, APITestCase):
    def test_scheduled_dish(self):
        dish = Dish.objects.create(name="Dish 1")
        ScheduledDish.objects.create(dish=dish, date=self.today)

        data = self.client.get(reverse("dishes-list")).json()

        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]["name"], "Dish 1")
        self.assertEqual(data[0]["date"], self.today.isoformat())
        self.assertTrue(data[0]["has_dishes_left"])

    def test_scheduled_dishes(self):
        dish = Dish.objects.create(name="Dish 1")
        ScheduledDish.objects.create(dish=dish, date=self.today)
        dish = Dish.objects.create(name="Dish 2")
        ScheduledDish.objects.create(dish=dish, date=self.tomorrow)

        data = self.client.get(reverse("dishes-list")).json()

        self.assertEqual(len(data), 2)
        self.assertEqual(data[0]["name"], "Dish 1")
        self.assertEqual(data[0]["date"], self.today.isoformat())
        self.assertTrue(data[0]["has_dishes_left"])
        self.assertEqual(data[1]["name"], "Dish 2")
        self.assertEqual(data[1]["date"], self.tomorrow.isoformat())
        self.assertTrue(data[1]["has_dishes_left"])

    def test_unable_to_schedule_dish_twice_for_the_same_date(self):
        dish = Dish.objects.create(name="Dish 1")

        # Schedule the dish for the 1st time
        ScheduledDish.objects.create(dish=dish, date=self.today)

        # Try to schedule it for the 2nd time
        with self.assertRaises(IntegrityError):
            ScheduledDish.objects.create(dish=dish, date=self.today)


class OrdersTests(TestCaseMixin, APITestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()

        dish_1 = Dish.objects.create(name="Dish 1")
        dish_2 = Dish.objects.create(name="Dish 2")

        cls.scheduled_dish_today = ScheduledDish.objects.create(
            dish=dish_1, date=cls.today
        )
        cls.scheduled_dish_tomorrow = ScheduledDish.objects.create(
            dish=dish_2, date=cls.tomorrow
        )

        # Create some users
        cls.user_1 = User.objects.create_user("user1@test.com", "test")
        cls.user_2 = User.objects.create_user("user2@test.com", "test")

    def setUp(self):
        self.global_preferences["max_orders_per_day"] = 2

        # Authenticate
        self.client.force_login(self.user_1)

    def test_unauthorized(self):
        self.client.logout()

        url = reverse("dishes-order", args=[self.scheduled_dish_today.id])
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_order(self):
        url = reverse("dishes-order", args=[self.scheduled_dish_today.id])

        # Order dish
        response = self.client.post(url)
        data = response.json()

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(data["name"], "Dish 1")
        self.assertEqual(data["orders_count"], 1)

        # Order the same dish again
        response = self.client.post(url)
        data = response.json()

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(data["name"], "Dish 1")
        self.assertEqual(data["orders_count"], 2)

    def test_max_orders_per_day(self):
        # Allow just a single order per day
        self.global_preferences["max_orders_per_day"] = 1

        url = reverse("dishes-order", args=[self.scheduled_dish_today.id])

        # 1st order (OK)
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # 2nd order (NOT OK)
        response = self.client.post(url)
        data = response.json()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(data["code"], MaxOrdersForDayError.code)

        # Ordering dishes for a different date should work
        url = reverse("dishes-order", args=[self.scheduled_dish_tomorrow.id])

        # 1st order (OK)
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # 2nd order (NOT OK)
        response = self.client.post(url)
        data = response.json()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(data["code"], MaxOrdersForDayError.code)

    def test_cancel_order(self):
        # Order a dish
        url = reverse("dishes-order", args=[self.scheduled_dish_today.id])
        response = self.client.post(url)
        data = response.json()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(data["orders_count"], 1)

        # Cancel the order
        response = self.client.delete(url)
        data = response.json()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(data["orders_count"], 0)

    def test_order_limited_dish(self):
        # Create, schedule and limit a dish to 1 order
        dish = Dish.objects.create(name="Dish")
        scheduled_dish = ScheduledDish.objects.create(
            dish=dish, date=self.today, orders_left=1
        )

        url = reverse("dishes-order", args=[scheduled_dish.id])

        # Place an order
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Place an order as a different user
        self.client.force_login(self.user_2)
        response = self.client.post(url)
        data = response.json()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(data["code"], NoDishesLeftError.code)

    def test_has_dishes_left(self):
        # Create, schedule and limit a dish to 1 order
        dish = Dish.objects.create(name="Dish")
        scheduled_dish = ScheduledDish.objects.create(
            dish=dish, date=self.today, orders_left=1
        )

        url = reverse("dishes-order", args=[scheduled_dish.id])

        # Place an order
        data = self.client.post(url).json()
        # No more dishes should be left
        self.assertFalse(data["has_dishes_left"])

        # Cancel the order
        data = self.client.delete(url).json()
        # Now there should be dishes left
        self.assertTrue(data["has_dishes_left"])

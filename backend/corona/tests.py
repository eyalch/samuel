from django.urls import reverse
from django.utils import timezone
from rest_framework import status, test

from users.models import User

from .models import HealthStatement


class CoronaTests(test.APITestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()

        cls.today = timezone.now().date()

        # Create a test user
        cls.user = User.objects.create_user("user@example.com", "User")

    def setUp(self):
        # Authenticate
        self.client.force_authenticate(self.user)

    def post_state_health(self):
        return self.client.post(reverse("corona-state-health"))

    def test_create_health_statement_unauthenticated(self):
        """
        Test that un-authenticated users are unable to state their health
        """

        # Logout
        self.client.logout()

        response = self.post_state_health()
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_health_statement(self):
        """
        Test that authenticated users are able to state their health and that a
        statement is registered
        """
        response = self.post_state_health()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        user_health_statements = HealthStatement.objects.filter(
            user=self.user, date=self.today
        )
        self.assertEqual(user_health_statements.count(), 1)

    def test_allow_to_state_only_once_per_day(self):
        """
        Test that a user is able to state their health only once per day
        """

        response = self.post_state_health()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response = self.post_state_health()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Ensure that only one statement was registered
        user_health_statements = HealthStatement.objects.filter(
            user=self.user, date=self.today
        )
        self.assertEqual(user_health_statements.count(), 1)

    def test_user_property_stated_health_today(self):
        """
        Test the value of User#stated_health_today
        """

        self.assertFalse(self.user.stated_health_today)
        self.post_state_health()
        self.assertTrue(self.user.stated_health_today)

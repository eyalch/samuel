from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

from corona.models import HealthStatement


class User(AbstractUser):
    domain = models.CharField(max_length=50, blank=False)

    def __str__(self):
        return f"{self.get_full_name()} ({self.get_username()})"

    @property
    def stated_health_today(self):
        today = timezone.now().date()
        return HealthStatement.objects.filter(date=today, user=self).exists()

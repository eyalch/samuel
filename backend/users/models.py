from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    domain = models.CharField(max_length=50, blank=False)

    def __str__(self):
        return self.get_full_name()

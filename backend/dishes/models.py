from django.db import models
from django.conf import settings


class Dish(models.Model):
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    image = models.ImageField(upload_to="dishes/", blank=True)
    next_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name_plural = "dishes"

    def __str__(self):
        return self.name


class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, models.SET_NULL, null=True)
    dish = models.ForeignKey(Dish, models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.dish}"

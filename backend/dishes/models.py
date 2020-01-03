from django.conf import settings
from django.db import models


class Dish(models.Model):
    DishType = models.TextChoices("DishType", "MAIN SALAD")

    name = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    image = models.ImageField(upload_to="dishes/", blank=True)
    dish_type = models.CharField(
        max_length=5, choices=DishType.choices, default=DishType.MAIN
    )

    class Meta:
        verbose_name_plural = "dishes"

    def __str__(self):
        return self.name


class ScheduledDish(models.Model):
    dish = models.ForeignKey(Dish, on_delete=models.CASCADE)
    date = models.DateField()
    max_orders = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        verbose_name_plural = "scheduled dishes"
        constraints = [
            models.UniqueConstraint(
                fields=["dish", "date"], name="unique_scheduled_dish"
            )
        ]

    def __str__(self):
        return f"{self.dish} @ {self.date}"


class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    scheduled_dish = models.ForeignKey(ScheduledDish, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.scheduled_dish}"

from django.db import models


class Dish(models.Model):
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    image = models.ImageField(upload_to="dishes/", blank=True)
    next_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name_plural = "dishes"

    def __str__(self):
        return self.name

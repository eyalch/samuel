from django.conf import settings
from django.db import models


class HealthStatement(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "date"], name="unique_health_statement"
            )
        ]
        ordering = ["-date"]

    def __str__(self):
        return str(self.user)

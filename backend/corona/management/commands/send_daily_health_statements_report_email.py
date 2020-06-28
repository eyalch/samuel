from django.conf import settings
from django.core.mail import send_mass_mail
from django.core.management.base import BaseCommand
from django.utils import timezone

from corona.models import HealthStatement


class Command(BaseCommand):
    help = "Send a daily report email of today's health statements"

    def handle(self, *args, **options):
        # Get today's health statements
        today = timezone.now().date()
        today_health_statements = HealthStatement.objects.filter(date=today)

        datatuple = []

        for domain, recipients in settings.CORONA_REPORT_DOMAIN_RECIPIENTS_MAP.items():
            # Get the domain users' health statements
            health_statements = today_health_statements.filter(user__domain=domain)

            # Skip if no statements
            if len(health_statements) == 0:
                continue

            # Get a list of users who made a statement
            users = [health_statement.user for health_statement in health_statements]

            subject = f"דוח הצהרות בריאות ({domain})"

            # The message body has on each line the user's full name & email
            body = "\n".join(
                [f"{user.get_full_name()} ({user.email})" for user in users]
            )

            datatuple.append((subject, body, settings.CORONA_FROM_EMAIL, recipients))

        messages_sent = send_mass_mail(
            datatuple,
            auth_user=settings.CORONA_EMAIL_HOST_USER,
            auth_password=settings.CORONA_EMAIL_HOST_PASSWORD,
        )

        if messages_sent > 0:
            self.stdout.write(
                self.style.SUCCESS("Successfully sent daily health statements report.")
            )
        else:
            self.stdout.write(self.style.WARNING("No health statements to report."))

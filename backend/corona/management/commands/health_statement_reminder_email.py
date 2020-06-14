from django.conf import settings
from django.core.mail import send_mail
from django.core.management.base import BaseCommand

subject = "הצהרת בריאות"
message = f"""בוקר טוב,

בהתאם להנחיות התו הסגול, אנא מלאו הצהרת בריאות:
{settings.BASE_URL}/corona

"""


class Command(BaseCommand):
    help = "Send a daily reminder email to fill the health statement"

    def handle(self, *args, **options):
        send_mail(
            subject,
            message,
            from_email=settings.CORONA_FROM_EMAIL,
            recipient_list=settings.CORONA_EMAIL_RECIPIENTS,
            auth_user=settings.CORONA_EMAIL_HOST_USER,
            auth_password=settings.CORONA_EMAIL_HOST_PASSWORD,
        )

        self.stdout.write(
            self.style.SUCCESS("Successfully send a health statement reminder.")
        )

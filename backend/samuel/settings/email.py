from . import env

EMAIL_HOST = env.str("EMAIL_HOST")
EMAIL_PORT = env.int("EMAIL_PORT")
EMAIL_HOST_USER = env.str("EMAIL_USER")
DEFAULT_FROM_EMAIL = env.str("EMAIL_USER")
EMAIL_HOST_PASSWORD = env.str("EMAIL_PASSWORD")
EMAIL_USE_TLS = True
EMAIL_RECIPIENTS = env.list("EMAIL_RECIPIENTS", default=[])
EMAIL_TEST_RECIPIENTS = env.list("EMAIL_TEST_RECIPIENTS", default=[])


# Staff

ADMINS = [("Eyal Cherevatzki", "eyal_c@mintapp.co.il")]

import os
import re

from . import env

BASE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../..")


DEBUG = env("DEBUG")


# Rollbar

rollbar_token = env.str("ROLLBAR_TOKEN", default="")
ROLLBAR = {
    "access_token": rollbar_token,
    "environment": "development" if DEBUG else "production",
    "branch": env.str("BRANCH", default="master"),
    "code_version": env.str("VERSION", default="development"),
    "root": "/backend",
    "enabled": rollbar_token and not DEBUG,
    "ignorable_404_urls": (re.compile("/admin"),),
    "capture_ip": True,
    "capture_email": True,
    "capture_username": True,
}


SECRET_KEY = env("SECRET_KEY")

ALLOWED_HOSTS = ["localhost", "127.0.0.1"]
ALLOWED_HOSTS += env.list("ALLOWED_HOSTS", default=[])

# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "dynamic_preferences",
    "rangefilter",
    "users",
    "dishes",
    "corona",
]

MIDDLEWARE = [
    "rollbar.contrib.django.middleware.RollbarNotifierMiddlewareOnly404",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "rollbar.contrib.django.middleware.RollbarNotifierMiddlewareExcluding404",
]

ROOT_URLCONF = "samuel.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ]
        },
    }
]

WSGI_APPLICATION = "samuel.wsgi.application"


# Database

DATABASES = {"default": env.db()}


# Internationalization

LANGUAGE_CODE = "en-us"

TIME_ZONE = env.str("TIME_ZONE", default="Asia/Jerusalem")

USE_I18N = True

USE_L10N = False

USE_TZ = False


# Date & time formats

DATE_FORMAT = "N j, Y"
TIME_FORMAT = "H:i"
DATETIME_FORMAT = f"{DATE_FORMAT}, {TIME_FORMAT}"
YEAR_MONTH_FORMAT = "F Y"
MONTH_DAY_FORMAT = "F j"
SHORT_DATE_FORMAT = "d/m/Y"
SHORT_DATETIME_FORMAT = f"{SHORT_DATE_FORMAT} {TIME_FORMAT}"


# Static files (CSS, JavaScript, Images)

STATIC_URL = "/staticfiles/"
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")


# Media files

MEDIA_URL = "/mediafiles/"
MEDIA_ROOT = os.path.join(BASE_DIR, "mediafiles")


# Django REST Framework

REST_FRAMEWORK = {
    "EXCEPTION_HANDLER": "samuel.exceptions.custom_exception_handler",
    "TEST_REQUEST_DEFAULT_FORMAT": "json",
}


# Logging

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {"console": {"class": "logging.StreamHandler"}},
    "loggers": {"django_auth_ldap": {"level": "DEBUG", "handlers": ["console"]}},
}


# Base URL

BASE_URL = env.str("BASE_URL")

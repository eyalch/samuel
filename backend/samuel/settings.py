import os
import re
from datetime import timedelta

import environ
import ldap
from django_auth_ldap.config import LDAPSearch

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


env = environ.Env(DEBUG=(bool, False))

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env("DEBUG")


# Rollbar

rollbar_token = env.str("ROLLBAR_TOKEN", default="")
ROLLBAR = {
    "access_token": rollbar_token,
    "environment": "development" if DEBUG else "production",
    "branch": "master",
    "root": "/backend",
    "enabled": rollbar_token and not DEBUG,
    "ignorable_404_urls": (re.compile("/admin"),),
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
    "users",
    "dishes",
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
# https://docs.djangoproject.com/en/2.2/ref/settings/#databases

DATABASES = {"default": env.db()}


# Password validation
# https://docs.djangoproject.com/en/2.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation."
        "UserAttributeSimilarityValidator"
    },
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]


# Internationalization
# https://docs.djangoproject.com/en/2.2/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = env.str("TIME_ZONE", default="Asia/Jerusalem")

USE_I18N = True

USE_L10N = True

USE_TZ = False


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.2/howto/static-files/

STATIC_URL = "/staticfiles/"
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")


# Media files

MEDIA_URL = "/mediafiles/"
MEDIA_ROOT = os.path.join(BASE_DIR, "mediafiles")


# User model

AUTH_USER_MODEL = "users.User"

AUTHENTICATION_BACKENDS = (
    "django.contrib.auth.backends.ModelBackend",
    "django_auth_ldap.backend.LDAPBackend",
)


# Django REST Framework

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
        "rest_framework.authentication.BasicAuthentication",
    ],
    "EXCEPTION_HANDLER": "samuel.exceptions.custom_exception_handler",
    "TEST_REQUEST_DEFAULT_FORMAT": "json",
}


# LDAP authentication

AUTH_LDAP_SERVER_URI = env.str("LDAP_SERVER_URI")

AUTH_LDAP_BIND_DN = env.str("LDAP_BIND_DN")
AUTH_LDAP_BIND_PASSWORD = env.str("LDAP_BIND_PASSWORD")

AUTH_LDAP_USER_SEARCH = LDAPSearch(
    env.str("LDAP_BASE_DN"), ldap.SCOPE_SUBTREE, "(sAMAccountName=%(user)s)"
)

# Populate the Django user from the LDAP directory.
AUTH_LDAP_USER_ATTR_MAP = {
    "username": "sAMAccountName",
    "email": "mail",
    "first_name": "givenName",
    "last_name": "sn",
}

AUTH_LDAP_ALWAYS_UPDATE_USER = True

# Minimize LDAP traffic
AUTH_LDAP_CACHE_TIMEOUT = 3600

# This is needed for Active Directory (no idea why)
AUTH_LDAP_CONNECTION_OPTIONS = {ldap.OPT_REFERRALS: 0}

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {"console": {"class": "logging.StreamHandler"}},
    "loggers": {"django_auth_ldap": {"level": "DEBUG", "handlers": ["console"]}},
}


# Simple JWT

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=5),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=21),
    "ROTATE_REFRESH_TOKENS": True,
}


# django-dynamic-preferences

DYNAMIC_PREFERENCES = {
    # a python attribute that will be added to model instances with preferences
    # override this if the default collide with one of your models attributes/fields
    "MANAGER_ATTRIBUTE": "preferences",
    # The python module in which registered preferences will be searched within each app
    "REGISTRY_MODULE": "dynamic_preferences_registry",
    # Allow quick editing of preferences directly in admin list view
    # WARNING: enabling this feature can cause data corruption if multiple users use the
    # same list view at the same time, see https://code.djangoproject.com/ticket/11313
    "ADMIN_ENABLE_CHANGELIST_FORM": True,
    # Customize how you can access preferences from managers. The default is to separate
    # sections and keys with two underscores. This is probably not a settings you'll
    # want to change, but it's here just in case
    "SECTION_KEY_SEPARATOR": "__",
    # Use this to disable caching of preference. This can be useful to debug things
    "ENABLE_CACHE": True,
    # Use this to disable checking preferences names. This can be useful to debug things
    "VALIDATE_NAMES": True,
}


# Email

EMAIL_HOST = env.str("EMAIL_HOST")
EMAIL_PORT = env.int("EMAIL_PORT")
EMAIL_HOST_USER = env.str("EMAIL_USER")
DEFAULT_FROM_EMAIL = env.str("EMAIL_USER")
EMAIL_HOST_PASSWORD = env.str("EMAIL_PASSWORD")
EMAIL_USE_TLS = True
EMAIL_RECIPIENTS = env.list("EMAIL_RECIPIENTS", default=[])
EMAIL_TEST_RECIPIENTS = env.list("EMAIL_TEST_RECIPIENTS", default=[])


# Base URL

BASE_URL = env.str("BASE_URL")


# Staff

ADMINS = [("Eyal Cherevatzki", "eyal_c@mintapp.co.il")]

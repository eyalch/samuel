from datetime import timedelta

import ldap
from django_auth_ldap.config import LDAPSearch

from . import env
from .base import REST_FRAMEWORK

AUTH_USER_MODEL = "users.User"

AUTHENTICATION_BACKENDS = (
    "django.contrib.auth.backends.ModelBackend",
    "django_auth_ldap.backend.LDAPBackend",
)

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation."
        "UserAttributeSimilarityValidator"
    },
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]


# LDAP

AUTH_LDAP_SERVER_URI = env.str("LDAP_SERVER_URI")
AUTH_LDAP_BIND_DN = env.str("LDAP_BIND_DN")
AUTH_LDAP_BIND_PASSWORD = env.str("LDAP_BIND_PASSWORD")
AUTH_LDAP_USER_SEARCH = LDAPSearch(
    env.str("LDAP_BASE_DN"),
    ldap.SCOPE_SUBTREE,
    "(|(userPrincipalName=%(user)s)(sAMAccountName=%(user)s)(mail=%(user)s))",
)
AUTH_LDAP_USER_ATTR_MAP = {
    "username": "sAMAccountName",
    "email": "mail",
    "first_name": "givenName",
    "last_name": "sn",
}
AUTH_LDAP_ALWAYS_UPDATE_USER = True
AUTH_LDAP_CACHE_TIMEOUT = 3600  # Minimize LDAP traffic
AUTH_LDAP_CONNECTION_OPTIONS = {ldap.OPT_REFERRALS: 0}  # This is needed for AD
AUTH_LDAP_USER_QUERY_FIELD = "username"


# Simple JWT

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=5),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=21),
    "ROTATE_REFRESH_TOKENS": True,
}


# Django REST Framework

REST_FRAMEWORK["DEFAULT_AUTHENTICATION_CLASSES"] = [
    "rest_framework_simplejwt.authentication.JWTAuthentication",
    "rest_framework.authentication.SessionAuthentication",
    "rest_framework.authentication.BasicAuthentication",
]

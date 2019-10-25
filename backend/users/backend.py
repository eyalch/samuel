from django_auth_ldap.backend import LDAPBackend


class CustomLDAPBackend(LDAPBackend):
    def authenticate(self, request, email=None, username=None, password=None, **kwargs):
        # Accept both `email` and `username` as the field name for the email
        # (mainly used for the Browsable API login)
        if email:
            username = email

        return LDAPBackend.authenticate(
            self, request, username=username, password=password, **kwargs
        )

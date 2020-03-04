from django.dispatch import receiver
from django_auth_ldap.backend import LDAPBackend, populate_user


@receiver(populate_user, sender=LDAPBackend)
def populate_user_handler(user, ldap_user, **kwargs):
    # Set the user's domain as the part after the @ in the userPrincipalName attribute
    user.domain = ldap_user.attrs["userprincipalname"][0].split("@")[1]

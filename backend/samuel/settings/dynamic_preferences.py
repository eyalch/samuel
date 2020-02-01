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

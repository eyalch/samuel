from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter

from apps.dishes import views


class OptionalSlashRouter(DefaultRouter):
    def __init__(self, *args, **kwargs):
        super(DefaultRouter, self).__init__(*args, **kwargs)
        self.trailing_slash = "/?"


router = OptionalSlashRouter()
router.register("dishes", views.DishViewSet)

urlpatterns = [path("admin/", admin.site.urls), path("", include(router.urls))]

# Serve media
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

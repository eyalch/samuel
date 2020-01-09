from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from dishes import views
from global_preferences.views import CustomGlobalPreferencesViewSet

admin.site.site_header = "Samuel administration"

router = DefaultRouter()
router.register("dishes", views.ScheduledDishViewSet, base_name="dishes")
router.register("preferences", CustomGlobalPreferencesViewSet, base_name="preferences")

api_patterns = [
    path("", include(router.urls)),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("auth/", include("rest_framework.urls")),
]

urlpatterns = [path("admin/", admin.site.urls), path("api/", include(api_patterns))]

# Serve media
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

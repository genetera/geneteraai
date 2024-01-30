from django.contrib import admin
from django.urls import path, include
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

schema_view = get_schema_view(
    openapi.Info(
        title="GENETERA AI API",
        default_version="v1",
        description="Open Source AI-Powered content generator with unique knowledge to your organization's data.",
        terms_of_service="https://genetera.com",
        contact=openapi.Contact(email="niadelite@gmail.com"),
        license=openapi.License(name="AGPL-3.0 license"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path(
        "swagger/",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    path("redoc/", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"),
    # Modules routing
    path("api/v1/auth/", include("authentication.urls")),
    path("api/v1/organizations/", include("organization.urls")),
    path("api/v1/projects/", include("project.urls")),
    path("api/v1/notifications/", include("notification.urls")),
    path("api/v1/contents/", include("content.urls")),
]

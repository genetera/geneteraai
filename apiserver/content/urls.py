from django.urls import path
from .views import (
    ContentListApiView,
    ContentDetailsApiView,
    CategoriesListApiView,
    PlatformsListApiView,
    EmotionsListApiView,
    ContentDownloadApiView,
    ContentSaveApiView,
)

urlpatterns = [
    path("categories/", CategoriesListApiView.as_view(), name="categories"),
    path("platforms/", PlatformsListApiView.as_view(), name="platforms"),
    path("emotions/", EmotionsListApiView.as_view(), name="emotions"),
    # Contents
    path("", ContentListApiView.as_view(), name="contents"),
    path("<content_id>", ContentDetailsApiView.as_view(), name="content_details"),
    path(
        "<content_id>/download/",
        ContentDownloadApiView.as_view(),
        name="content_download",
    ),
    path(
        "<content_id>/save/",
        ContentSaveApiView.as_view(),
        name="content_save",
    ),
]

from django.urls import path
from .views import (
    ProjectListApiView,
    ProjectDetailsApiView,
    ProjectMemberInvitesListApiView,
)

urlpatterns = [
    path("", ProjectListApiView.as_view(), name="projects"),
    path(
        "<project_id>",
        ProjectDetailsApiView.as_view(),
        name="project_details",
    ),
    path(
        "<project_id>/invites",
        ProjectMemberInvitesListApiView.as_view(),
        name="project_member_invites",
    ),
]

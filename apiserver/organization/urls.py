from django.urls import path
from .views import (
    OrganizationListApiView,
    OrganizationDetailsApiView,
    OrganizationMemberInvitesListApiView,
)

urlpatterns = [
    path("", OrganizationListApiView.as_view(), name="organizations"),
    path(
        "<organization_id>",
        OrganizationDetailsApiView.as_view(),
        name="organization_details",
    ),
    path(
        "<organization_slug>/invites",
        OrganizationMemberInvitesListApiView.as_view(),
        name="organization_member_invites",
    ),
]

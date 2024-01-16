from django.urls import path
from .views import (
    OrganizationListApiView,
    OrganizationDetailsApiView,
    OrganizationMemberInvitesListApiView,
    DocumentsListApiView,
    DocumentsDetailsApiView,
    DocumentsUploadApiView,
)

urlpatterns = [
    path("", OrganizationListApiView.as_view(), name="organizations"),
    path(
        "<organization_id>",
        OrganizationDetailsApiView.as_view(),
        name="organization_details",
    ),
    path(
        "<organization_id>/invites",
        OrganizationMemberInvitesListApiView.as_view(),
        name="organization_member_invites",
    ),
    path(
        "<organization_id>/documents",
        DocumentsListApiView.as_view(),
        name="organization_documents",
    ),
    path(
        "<organization_id>/documents/upload",
        DocumentsUploadApiView.as_view(),
        name="organization_document_upload",
    ),
    path(
        "<organization_id>/documents/<document_id>",
        DocumentsDetailsApiView.as_view(),
        name="organization_document_details",
    ),
]

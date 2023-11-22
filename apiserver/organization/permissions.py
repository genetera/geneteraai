from rest_framework.permissions import BasePermission, SAFE_METHODS
from django.db.models import Q
from .models import OrganizationMember
from .constants import ORGANIZATION_ROLES


class IsOrganizationOwnerOrAdmin(BasePermission):
    def has_permission(self, request, view):
        print(view)
        # For GET, OPTIONS and HEAD Requests grant access
        if request.method in SAFE_METHODS:
            return True

        # ...For other requests check whether User is owner or admin of organization
        return OrganizationMember.objects.filter(
            organization__id=view.organization_id,
            member=request.user,
            role__in=[
                ORGANIZATION_ROLES["OWNER"],
                ORGANIZATION_ROLES["ADMIN"],
            ],
        )

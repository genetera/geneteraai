from rest_framework.permissions import BasePermission, SAFE_METHODS
from django.db.models import Q
from .models import ProjectMember
from .constants import PROJECT_ROLES


class IsProjectOwnerOrAdmin(BasePermission):
    def has_permission(self, request, view):
        # For GET, OPTIONS and HEAD Requests grant access
        if request.method in SAFE_METHODS:
            return True

        # ...For other requests check whether User is owner or admin of project
        return ProjectMember.objects.filter(
            project__id=view.project_id,
            member=request.user,
            role__in=[
                PROJECT_ROLES["OWNER"],
                PROJECT_ROLES["ADMIN"],
            ],
        )

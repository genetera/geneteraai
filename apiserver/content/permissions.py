from rest_framework.permissions import BasePermission, SAFE_METHODS
from django.db.models import Q
from .models import Content


class IsContentOwner(BasePermission):
    def has_permission(self, request, view):
        # For GET, OPTIONS and HEAD Requests grant access
        if request.method in SAFE_METHODS:
            return True

        # ...For other requests check whether User is creator of content
        return Content.objects.filter(
            id=view.content_id,
            created_by=request.user,
        )

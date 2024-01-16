from django.contrib import admin
from .models import (
    Organization,
    OrganizationMember,
    OrganizationMemberInvite,
    OrganizationDocument,
)


admin.site.register(Organization)
admin.site.register(OrganizationMember)
admin.site.register(OrganizationMemberInvite)
admin.site.register(OrganizationDocument)

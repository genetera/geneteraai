from django.contrib import admin
from .models import Organization, OrganizationMember


admin.site.register(Organization)
admin.site.register(OrganizationMember)

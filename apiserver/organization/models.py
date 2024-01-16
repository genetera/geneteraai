import uuid

from django.db import models
from django.contrib.postgres.fields import JSONField
from django.conf import settings


ROLE_CHOICES = (
    (5, "Owner"),
    (10, "Admin"),
    (15, "Member"),
    (20, "Guest"),
)


class Organization(models.Model):
    id = models.UUIDField(
        default=uuid.uuid4, unique=True, db_index=True, editable=False, primary_key=True
    )
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=50, db_index=True, unique=True)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="owner_organization",
    )
    organization_size = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Organization"
        verbose_name_plural = "Organizations"
        db_table = "organizations"
        ordering = ("-created_at",)


class OrganizationMember(models.Model):
    id = models.UUIDField(
        default=uuid.uuid4, unique=True, db_index=True, editable=False, primary_key=True
    )
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name="organization_member",
    )
    member = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="member_organization",
    )
    role = models.PositiveSmallIntegerField(choices=ROLE_CHOICES, default=15)
    company_role = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        """Returns members of organization"""
        return f"{self.member.email} - <{self.organization.name}>"

    class Meta:
        verbose_name = "Organization Member"
        verbose_name_plural = "Organization Members"
        db_table = "organization_members"
        ordering = ("-created_at",)


class OrganizationMemberInvite(models.Model):
    id = models.UUIDField(
        default=uuid.uuid4, unique=True, db_index=True, editable=False, primary_key=True
    )
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name="organization_invite",
    )
    email = models.CharField(max_length=150)
    token = models.CharField(max_length=255)
    accepted = models.BooleanField(default=False)
    role = models.PositiveSmallIntegerField(choices=ROLE_CHOICES, default=20)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="organization_invite_creator",
        null=True,  # TODO Need to be removed as it is mandatory
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.email} - <{self.organization.name}>"

    class Meta:
        verbose_name = "Organization Member Invite"
        verbose_name_plural = "Organization Member Invites"
        db_table = "organization_member_invites"
        ordering = ("-created_at",)


class OrganizationDocument(models.Model):
    id = models.UUIDField(
        default=uuid.uuid4, unique=True, db_index=True, editable=False, primary_key=True
    )
    name = models.CharField(max_length=255)
    size = models.CharField(max_length=20)
    metadata = models.JSONField(null=False, blank=True, default=dict)
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name="organization_document",
    )
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="creator_organization",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        """Returns name of document"""
        return self.name

    class Meta:
        verbose_name = "Organization Document"
        verbose_name_plural = "Organization Documents"
        db_table = "organization_documents"
        ordering = ("-created_at",)

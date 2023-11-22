import uuid

from django.db import models
from django.conf import settings

from organization.models import Organization


ROLE_CHOICES = ((5, "Owner"), (10, "Admin"), (15, "Member"), (20, "Guest"))


class Project(models.Model):
    id = models.UUIDField(
        default=uuid.uuid4, unique=True, db_index=True, editable=False, primary_key=True
    )
    name = models.CharField(max_length=255)
    identifier = models.CharField(
        max_length=12,
        verbose_name="Project Identifier",
    )
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name="organization_project",
    )
    creted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="project_creator",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        """Returns name of project"""
        return f"{self.name} <{self.organization.name}>"

    class Meta:
        verbose_name = "Project"
        verbose_name_plural = "Projects"
        db_table = "projects"
        ordering = ("-created_at",)

    def save(self, *args, **kwargs):
        self.identifier = self.identifier.strip().upper()
        return super().save(*args, **kwargs)


class ProjectnMember(models.Model):
    id = models.UUIDField(
        default=uuid.uuid4, unique=True, db_index=True, editable=False, primary_key=True
    )
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="project_member",
    )
    member = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="member_project",
    )
    role = models.PositiveSmallIntegerField(choices=ROLE_CHOICES, default=15)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        """Returns members of project"""
        return f"{self.member.email} - <{self.project.name}>"

    class Meta:
        verbose_name = "Project Member"
        verbose_name_plural = "Project Members"
        db_table = "project_members"
        ordering = ("-created_at",)

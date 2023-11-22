import uuid

from django.db import models
from django.conf import settings
from organization.models import Organization
from project.models import Project


class Notification(models.Model):
    id = models.UUIDField(
        default=uuid.uuid4, unique=True, db_index=True, editable=False, primary_key=True
    )
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name="notifications",
    )
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="notifications",
        blank=True,
        null=True,
    )
    title = models.CharField(max_length=255)
    message = models.TextField()
    message_html = models.TextField(blank=True, default="<p></p>")
    sender = models.CharField(max_length=100)
    triggered_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="triggered_notifications",
        null=True,
        blank=True,
    )
    receiver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="received_notifications",
    )
    read_at = models.DateTimeField(null=True)
    archived_at = models.DateTimeField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        """Returns name of notifications"""
        return f"{self.receiver.email} - <{self.organization.name}>"

    class Meta:
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"
        db_table = "notifications"
        ordering = ("-created_at",)

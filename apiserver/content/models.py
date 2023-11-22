import uuid

from django.db import models
from django.conf import settings
from organization.models import Organization
from project.models import Project


class Content(models.Model):
    PRIORITY_CHOICES = (
        ("urgent", "Urgent"),
        ("high", "High"),
        ("medium", "Medium"),
        ("low", "Low"),
        ("none", "None"),
    )
    STATUS_CHOICES = (
        ("5", "Published"),
        ("10", "Done"),
        ("15", "In progress"),
        ("20", "Todo"),
    )

    id = models.UUIDField(
        default=uuid.uuid4, unique=True, db_index=True, editable=False, primary_key=True
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    content = models.TextField()
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name="organization_content",
    )
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="project_content",
    )
    platform = models.ForeignKey(
        "ContentPlatform",
        on_delete=models.SET_DEFAULT,
        related_name="platform_content",
        default=1,
    )
    category = models.ForeignKey(
        "ContentCategory",
        on_delete=models.SET_DEFAULT,
        related_name="category_content",
        default=1,
    )
    emotion = models.ForeignKey(
        "ContentEmotion",
        on_delete=models.SET_DEFAULT,
        related_name="emotion_content",
        default=1,
    )
    status = models.PositiveSmallIntegerField(choices=STATUS_CHOICES, default=20)
    priority = models.CharField(max_length=30, choices=PRIORITY_CHOICES, default="none")
    can_be_edited = models.BooleanField(default=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="creator",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.title

    class Meta:
        verbose_name = "Content"
        verbose_name_plural = "Contents"
        db_table = "contents"
        ordering = ("-created_at",)


class ContentPlatform(models.Model):
    id = models.UUIDField(
        default=uuid.uuid4, unique=True, db_index=True, editable=False, primary_key=True
    )
    name = models.CharField(max_length=50)
    icon = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        "Returns name of platform"
        return self.name

    class Meta:
        verbose_name = "Content Platform"
        verbose_name_plural = "Content Platforms"
        db_table = "content_platforms"


class ContentCategory(models.Model):
    id = models.UUIDField(
        default=uuid.uuid4, unique=True, db_index=True, editable=False, primary_key=True
    )
    name = models.CharField(max_length=50)
    icon = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        "Returns name of category"
        return self.name

    class Meta:
        verbose_name = "Content Category"
        verbose_name_plural = "Content Categories"
        db_table = "content_categories"


class ContentEmotion(models.Model):
    id = models.UUIDField(
        default=uuid.uuid4, unique=True, db_index=True, editable=False, primary_key=True
    )
    name = models.CharField(max_length=50)
    icon = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        "Returns name of emotion"
        return self.name

    class Meta:
        verbose_name = "Content Emotion"
        verbose_name_plural = "Content Emotions"
        db_table = "content_emotions"

from rest_framework import serializers

from .models import Content, ContentPlatform, ContentCategory, ContentEmotion
from organization.serializers import OrganizationSerializer
from project.serializers import ProjectSerializer


class ContentPlatformSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentPlatform
        fields = ["id", "name", "url", "icon"]
        read_only_fields = [
            "id",
            "icon",
            "created_at",
            "updated_at",
        ]


class ContentCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentCategory
        fields = ["id", "name", "icon"]
        read_only_fields = [
            "id",
            "icon",
            "created_at",
            "updated_at",
        ]


class ContentEmotionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentEmotion
        fields = ["id", "name", "icon"]
        read_only_fields = [
            "id",
            "icon",
            "created_at",
            "updated_at",
        ]


class ContentSerializer(serializers.ModelSerializer):
    organization = OrganizationSerializer(read_only=True)
    project = ProjectSerializer(read_only=True)
    platform = ContentPlatformSerializer(read_only=True)
    category = ContentCategorySerializer(read_only=True)
    emotion = ContentEmotionSerializer(read_only=True)
    status = serializers.SerializerMethodField()
    priority = serializers.SerializerMethodField()

    class Meta:
        model = Content
        fields = [
            "id",
            "title",
            "content",
            "description",
            "organization",
            "project",
            "platform",
            "category",
            "emotion",
            "status",
            "priority",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]

    def get_status(self, obj):
        index = None
        for indx, status in enumerate(Content.STATUS_CHOICES):
            if status[0] == obj.status:
                index = indx
                break
        return Content.STATUS_CHOICES[index][1]

    def get_priority(self, obj):
        index = None
        for indx, priority in enumerate(Content.PRIORITY_CHOICES):
            if priority[0] == obj.priority:
                index = indx
                break
        return Content.PRIORITY_CHOICES[index][1]


class CreateContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Content
        fields = [
            "title",
            "description",
            "organization",
            "project",
            "platform",
            "category",
            "emotion",
        ]

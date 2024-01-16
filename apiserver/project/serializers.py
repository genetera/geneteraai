from rest_framework import serializers
from .models import Project, ProjectMember


class ProjectSerializer(serializers.ModelSerializer):
    organization_name = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = "__all__"
        read_only_fields = [
            "id",
            "identifier",
            "created_by",
            "created_at",
            "updated_at",
        ]

    def get_organization_name(self, obj):
        return obj.organization.name


class ProjectMemberInviteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectMember
        fields = ["id", "role", "created_at"]
        read_only_fields = [
            "id",
            "project",
            "member",
            "created_at",
            "updated_at",
        ]

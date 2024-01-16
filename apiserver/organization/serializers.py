from rest_framework import serializers

from .models import Organization, OrganizationMemberInvite, OrganizationDocument


class OrganizationSerializer(serializers.ModelSerializer):
    created_at = serializers.SerializerMethodField()

    class Meta:
        model = Organization
        fields = "__all__"
        read_only_fields = [
            "id",
            "owner",
            "slug",
            "created_at",
            "updated_at",
        ]

    def get_created_at(self, obj):
        return obj.created_at.strftime("%Y-%m-%d %H:%M")


class OrganizationMemberInviteSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationMemberInvite
        fields = ["id", "email", "role", "created_at"]
        read_only_fields = [
            "id",
            "organization",
            "token",
            "created_at",
            "updated_at",
        ]


class OrganizationDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationDocument
        fields = ["id", "name", "size"]
        read_only_fields = [
            "id",
            "organization",
        ]

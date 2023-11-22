from rest_framework import serializers

from .models import Organization, OrganizationMemberInvite


class OrganizationSerializer(serializers.ModelSerializer):
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

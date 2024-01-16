from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = "__all__"
        read_only_fields = [
            "id",
            "read_at",
            "archived_at",
            "created_at",
            "updated_at",
        ]

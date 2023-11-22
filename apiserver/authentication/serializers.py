from django.core.validators import validate_email
from django.core.exceptions import ValidationError

from rest_framework import serializers

# Thirdyparty imports

from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
            "is_superuser",
            "is_staff",
            "last_active",
            "last_login_time",
            "last_logout_time",
            "last_login_ip",
            "last_logout_ip",
        ]
        extra_kwargs = {"password": {"write_only": True}}


class ChangePasswordSerializer(serializers.Serializer):
    model = User

    # Serializer fields
    old_password = serializers.CharField(max_length=100)
    new_password = serializers.CharField(max_length=100)
    confirm_new_password = serializers.CharField(max_length=100)

    def validate(self, data):
        if data["new_password"] != data["confirm_new_password"]:
            raise serializers.ValidationError(
                "New password does not match with the confirm one."
            )
        return data


class SignUpSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    password = serializers.CharField(max_length=100)
    confirm_password = serializers.CharField(max_length=100)

    def validate(self, data):
        try:
            validate_email(data["email"])
        except ValidationError:
            raise serializers.ValidationError("Invalid Email adress")

        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError(
                "Password does not match with the confirm one."
            )
        return data


class PasswordResetSerializer(serializers.Serializer):
    model = User

    new_password = serializers.CharField(max_length=255)
    confirm_password = serializers.CharField(max_length=255)

    def validate(self, data):
        if data["new_password"] == "" or data["confirm_password"] == "":
            raise serializers.ValidationError("All password inputs are required.")
        if data["new_password"] != data["confirm_password"]:
            raise serializers.ValidationError("Passwords does not match.")

        return data

import jwt
import datetime

from django.db.models import Subquery, Q
from django.conf import settings
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework import status
from rest_framework.response import Response

from .models import Organization, OrganizationMember, OrganizationMemberInvite
from .serializers import OrganizationSerializer, OrganizationMemberInviteSerializer
from .constants import ORGANIZATION_ROLES
from .permissions import IsOrganizationOwnerOrAdmin
from .tasks import organization_invitation

from sentry_sdk import capture_exception


class OrganizationListApiView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None, *args, **kwargs):
        """Returns all organizations owned by loged In user or is member of."""
        try:
            subquery = Subquery(
                OrganizationMember.objects.filter(member=request.user).values_list(
                    "organization__id"
                )
            )
            organizations = Organization.objects.filter(
                Q(owner=request.user) | Q(pk__in=subquery)
            )
            serializer = OrganizationSerializer(organizations, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            capture_exception(e)
            return Response(
                {"error": "Failed try again"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def post(self, request, format=None, *args, **kwargs):
        try:
            serializer = OrganizationSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            organization_obj = serializer.save(owner=request.user)

            # Add user in organization member as owner
            OrganizationMember.objects.create(
                organization=organization_obj,
                member=request.user,
                role=ORGANIZATION_ROLES["OWNER"],
            )
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            capture_exception(e)
            return Response(
                {"error": "Failed try again." + str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class OrganizationDetailsApiView(APIView):
    """
    Class to update and delete Organization.
    -Only Organization owner or admin members who are allowed to perfom
    mentioned actions
    """

    permission_classes = [
        permissions.IsAuthenticated,
        IsOrganizationOwnerOrAdmin,
    ]

    def put(self, request, organization_slug, format=None, *args, **kwargs):
        try:
            organization_obj = Organization.objects.get(slug=organization_slug)
            serializer = OrganizationSerializer(
                instance=organization_obj, data=request.data
            )
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Organization.DoesNotExist:
            return Response(
                {"error": "Organization not found"}, status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            capture_exception(e)
            return Response(
                {"error": "Failed, try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def delete(self, request, organization_id, format=None, *args, **kwargs):
        try:
            organization_obj = Organization.objects.get(id=organization_id)
            organization_obj.delete()
            return Response(
                {"message": "Organization deleted successfully."},
                status=status.HTTP_200_OK,
            )

        except Organization.DoesNotExist:
            return Response(
                {"error": "Organization not found"}, status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            capture_exception(e)
            return Response(
                {"error": "Failed, try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @property
    def organization_id(self):
        return self.kwargs.get("organization_id", None)


class OrganizationMemberInvitesListApiView(APIView):
    permission_classes = [
        permissions.IsAuthenticated,
        IsOrganizationOwnerOrAdmin,
    ]

    def get(self, request, organization_slug, *args, **kwargs):
        try:
            org_invites = OrganizationMemberInvite.objects.filter(
                organization__slug=organization_slug
            )
            serializer = OrganizationMemberInviteSerializer(data=org_invites, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            capture_exception(e)
            return Response(
                {"error": "Failed, try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class InviteOrganizationApiView(APIView):
    permission_classes = [
        permissions.IsAuthenticated,
        IsOrganizationOwnerOrAdmin,
    ]

    def post(self, request, organization_slug, *args, **kwargs):
        try:
            emails = request.data.get("email", None)

            if emails is None or not len(emails):
                return Response(
                    {"error": "Emails are required."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            organization = Organization.objects.get(slug=organization_slug)
            organization_members = OrganizationMember.objects.filter(
                organization=organization,
                member__email__in=[email.get("email") for email in emails],
            )

            if len(organization_members):
                return Response(
                    {
                        "error": "Some users with provided emails are already member of organization."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            organization_invites = []
            emails_to_send_data = []
            for email in emails:
                try:
                    validate_email(email)
                    token = jwt.encode(
                        {
                            "email": email.get("email"),
                            "timestamp": datetime.now().timestamp(),
                        },
                        settings.SECRET_KEY,
                        algorithm="HS256",
                    )
                    organization_invites.append(
                        OrganizationMemberInvite(
                            organization=organization,
                            email=email.get("email"),
                            token=token,
                            role=email.get("role", ORGANIZATION_ROLES["GUEST"]),
                            created_by=request.user,
                        )
                    )
                    emails_to_send_data.append(
                        {
                            "email": email.get("email"),
                            "token": token,
                            "role": email.get("role", ORGANIZATION_ROLES["GUEST"]),
                        }
                    )
                except ValidationError as verror:
                    return Response(
                        {"error": f"Provided {email} is invalid"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )
            OrganizationMemberInvite.objects.bulk_create(
                organization_invites, batch_size=20
            )

            for email in emails_to_send_data:
                # ... Trigger send invitation email task
                organization_invitation.delay(
                    email.get("token"), email.get("email"), email.get("role")
                )

            return Response(
                {"message": "Emails sent successfully"}, status=status.HTTP_200_OK
            )
        except Exception as e:
            capture_exception(e)
            return Response(
                {"error": "Failed, try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

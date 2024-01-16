import jwt
import datetime
import tempfile
import os

from django.core.files.uploadedfile import InMemoryUploadedFile

from django.db.models import Subquery, Q
from django.conf import settings
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework import status
from rest_framework.response import Response

from .models import (
    Organization,
    OrganizationMember,
    OrganizationMemberInvite,
    OrganizationDocument,
)
from .serializers import (
    OrganizationSerializer,
    OrganizationMemberInviteSerializer,
    OrganizationDocumentSerializer,
)
from .constants import ORGANIZATION_ROLES
from .permissions import IsOrganizationOwnerOrAdmin, IsOrganizationMember
from .tasks import organization_invitation
from .utils import convert_file_size, generate_document_chunks_ids

from content.ai.document_manager import DocManager

from sentry_sdk import capture_exception


class OrganizationListApiView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None, *args, **kwargs):
        """Returns all organizations owned by loged In user or is member of."""
        try:
            organizations = Organization.objects.filter(
                Q(owner=request.user)
                | Q(
                    pk__in=Subquery(
                        OrganizationMember.objects.filter(
                            member=request.user
                        ).values_list("organization__id")
                    )
                )
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
                {"error": "Failed try again."},
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

    def get(self, request, organization_id, format=None, *args, **kwargs):
        try:
            organization_obj = Organization.objects.get(pk=organization_id)
            serializer = OrganizationSerializer(organization_obj)
            return Response(serializer.data, status=status.HTTP_200_OK)

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

    def put(self, request, organization_id, format=None, *args, **kwargs):
        try:
            organization_obj = Organization.objects.get(pk=organization_id)
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
        IsOrganizationMember,
    ]

    def get(self, request, organization_id, *args, **kwargs):
        try:
            org_invites = OrganizationMemberInvite.objects.filter(
                organization__id=organization_id
            )
            serializer = OrganizationMemberInviteSerializer(data=org_invites, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            capture_exception(e)
            return Response(
                {"error": "Failed, try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @property
    def organization_id(self):
        return self.kwargs.get("organization_id", None)


class InviteOrganizationApiView(APIView):
    permission_classes = [
        permissions.IsAuthenticated,
        IsOrganizationOwnerOrAdmin,
    ]

    def post(self, request, organization_id, *args, **kwargs):
        try:
            emails = request.data.get("email", None)

            if emails is None or not len(emails):
                return Response(
                    {"error": "Emails are required."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            organization = Organization.objects.get(pk=organization_id)
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

    @property
    def organization_id(self):
        return self.kwargs.get("organization_id", None)


class DocumentsListApiView(APIView):
    permission_classes = [
        permissions.IsAuthenticated,
        IsOrganizationMember,
    ]

    def get(self, request, organization_id, *args, **kwargs):
        try:
            documents = OrganizationDocument.objects.filter(
                organization__id=organization_id
            )
            serializer = OrganizationDocumentSerializer(documents, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            capture_exception(e)
            return Response(
                {"error": "Failed, try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @property
    def organization_id(self):
        return self.kwargs.get("organization_id", None)


class DocumentsDetailsApiView(APIView):
    permission_classes = [
        permissions.IsAuthenticated,
        IsOrganizationOwnerOrAdmin,
    ]

    def delete(self, request, organization_id, document_id, *args, **kwargs):
        try:
            document = OrganizationDocument.objects.get(id=document_id)

            doc_ids = document.metadata.get("ids")

            doc = DocManager(
                open_ai_api_key=settings.OPEN_AI_API_KEY,
                pinecone_api_key=settings.PINECONE_API_KEY,
                pinecone_env=settings.PINECONE_ENV,
            )

            PINECONE_INDEX = "genetera"

            # ... Delete document from Pinecone vector DB.

            doc.delete_by_document_ids(
                index_name=PINECONE_INDEX,
                document_ids=doc_ids,
                namespace=organization_id,
            )

            # ... Delete document metadata from Genetera DB.
            document.delete()

            return Response(
                {"message": "Document deleted successfully."}, status=status.HTTP_200_OK
            )
        except OrganizationDocument.DoesNotExist:
            return Response(
                {"error": "Document not found."},
                status=status.HTTP_400_BAD_REQUEST,
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


class DocumentsUploadApiView(APIView):
    permission_classes = [
        permissions.IsAuthenticated,
        IsOrganizationOwnerOrAdmin,
    ]

    def post(self, request, organization_id, *args, **kwargs):
        try:
            document = request.FILES["0"]

            DOC_SIZE = 5000000  # 5 Megabytes

            if document.size > DOC_SIZE:
                return Response(
                    {"error": "Uploaded file is large."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            document_name = document.name
            document_size = convert_file_size(document.size)

            # Save Document MetaData to Genetera DB.
            organization = Organization.objects.get(id=organization_id)
            document_obj = OrganizationDocument.objects.create(
                organization=organization,
                uploaded_by=request.user,
                name=document_name,
                size=document_size,
            )

            serializer = OrganizationDocumentSerializer(document_obj)

            doc = DocManager(
                open_ai_api_key=settings.OPEN_AI_API_KEY,
                pinecone_api_key=settings.PINECONE_API_KEY,
                pinecone_env=settings.PINECONE_ENV,
            )

            PINECONE_INDEX_NAME = "genetera"

            with tempfile.NamedTemporaryFile(delete=False) as tmp_file:
                tmp_file.write(document.read())
            loaded_document_chunks = doc.load_document_and_split(tmp_file.name)
            os.remove(tmp_file.name)

            document_chunks_ids = generate_document_chunks_ids(
                str(document_obj.id), len(loaded_document_chunks)
            )
            json_data = {"ids": document_chunks_ids}

            document_obj.metadata = json_data
            document_obj.save()

            doc.load_embeddings_to_db(
                chunk_texts=loaded_document_chunks,
                index_name=PINECONE_INDEX_NAME,
                namespace=organization_id,
                ids=document_chunks_ids,
            )  # We save documents embedding with namespaces equal to id of organization.

            return Response(
                serializer.data,
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            capture_exception(e)
            print(e)
            return Response(
                {"error": "Failed, try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @property
    def organization_id(self):
        return self.kwargs.get("organization_id", None)

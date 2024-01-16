from django.db.models import Subquery, Q

from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework import status
from rest_framework.response import Response

from .models import Project, ProjectMember
from organization.models import Organization, OrganizationMember
from .serializers import ProjectSerializer, ProjectMemberInviteSerializer
from .constants import PROJECT_ROLES

from .permissions import IsProjectOwnerOrAdmin


from sentry_sdk import capture_exception


class ProjectListApiView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None, *args, **kwargs):
        """Returns all projects owned by loged In user or
        projects belongs to organization user is member of.
        """
        try:
            organizations_list = []
            if "organizations" in request.query_params:
                organizations_list = request.query_params["organizations"].split(",")

            projects = Project.objects.filter(
                Q(created_by=request.user)
                | Q(
                    organization__pk__in=Subquery(
                        OrganizationMember.objects.filter(
                            member=request.user
                        ).values_list("organization__id")
                    )
                )
            )

            # Apply filter if organizations list is provided
            if len(organizations_list) >= 1 and organizations_list[0] != "":
                projects = projects.filter(organization__pk__in=organizations_list)

            serializer = ProjectSerializer(projects, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            capture_exception(e)
            return Response(
                {"error": "Failed try again"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def post(self, request, format=None, *args, **kwargs):
        try:
            organization_id = request.data.get("organization", "")
            serializer = ProjectSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            organization = Organization.objects.get(pk=organization_id)

            project_obj = serializer.save(
                organization=organization, created_by=request.user
            )

            # Add user in project member as owner
            ProjectMember.objects.create(
                project=project_obj,
                member=request.user,
                role=PROJECT_ROLES["OWNER"],
            )
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Project.DoesNotExist:
            return Response(
                {"error": "Invalid project id"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        except Exception as e:
            capture_exception(e)
            return Response(
                {"error": "Failed try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class ProjectDetailsApiView(APIView):
    """
    Class to update and delete Project.
    -Only Project owner or admin members who are allowed to perfom
    mentioned actions
    """

    permission_classes = [
        permissions.IsAuthenticated,
        IsProjectOwnerOrAdmin,
    ]

    def put(self, request, project_id, format=None, *args, **kwargs):
        try:
            project_obj = Project.objects.get(pk=project_id)
            serializer = ProjectSerializer(instance=project_obj, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Project.DoesNotExist:
            return Response(
                {"error": "Project not found"}, status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            capture_exception(e)
            return Response(
                {"error": "Failed, try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def delete(self, request, project_id, format=None, *args, **kwargs):
        try:
            project_obj = Project.objects.get(id=project_id)
            project_obj.delete()
            return Response(
                {"message": "Project deleted successfully."},
                status=status.HTTP_200_OK,
            )

        except Project.DoesNotExist:
            return Response(
                {"error": "Project not found"}, status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            capture_exception(e)
            return Response(
                {"error": "Failed, try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @property
    def project_id(self):
        return self.kwargs.get("project_id", None)


class ProjectMemberInvitesListApiView(APIView):
    permission_classes = [
        permissions.IsAuthenticated,
        IsProjectOwnerOrAdmin,
    ]

    def get(self, request, project_id, *args, **kwargs):
        try:
            project_invites = ProjectMember.objects.filter(project__id=project_id)
            serializer = ProjectMemberInviteSerializer(data=project_invites, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            capture_exception(e)
            return Response(
                {"error": "Failed, try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

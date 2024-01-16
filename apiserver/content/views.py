from django.db.models import Q, Subquery
from django.conf import settings
from django.http import HttpResponse

from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework import status
from rest_framework.response import Response


from project.models import ProjectMember
from organization.models import OrganizationMember

from .models import Content, ContentPlatform, ContentCategory, ContentEmotion
from .serializers import (
    ContentSerializer,
    CreateContentSerializer,
    ContentPlatformSerializer,
    ContentCategorySerializer,
    ContentEmotionSerializer,
)
from .permissions import IsContentOwner
from .filters import filter_contents
from .constants import ORGANIZATION_ROLES, PROJECT_ROLES
from .ai.content_generator import ContentGenerator
from .utils import generate_pdf

from sentry_sdk import capture_exception


class ContentListApiView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None, *args, **kwargs):
        """Returns all contents."""
        try:
            # ... Filter variables
            organizations = request.query_params.get("organizations", "")
            projects = request.query_params.get("projects", "")
            categories = request.query_params.get("categories", "")
            platforms = request.query_params.get("platforms", "")
            emotions = request.query_params.get("emotions", "")

            queryset = Content.objects.filter(
                Q(created_by=request.user)  # ... Content created by logedIn user. OR
                | Q(
                    project__id__in=Subquery(
                        ProjectMember.objects.filter(member=request.user).values_list(
                            "project__id"
                        )
                    )
                )  # ... Content belongs to projects logedIn user is member of. OR
                | Q(
                    organization__id__in=Subquery(
                        OrganizationMember.objects.filter(
                            member=request.user
                        ).values_list("organization__id")
                    )
                )  # ... Content belongs to organizations logedIn user is member of.
            ).order_by("-created_at")

            contents = filter_contents(
                queryset, organizations, projects, categories, platforms, emotions
            )
            serializer = ContentSerializer(contents, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            capture_exception(e)
            print(e)
            return Response(
                {"error": "Failed try again"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def post(self, request, format=None, *args, **kwargs):
        try:
            serializer = CreateContentSerializer(data=request.data)

            # Check if provided data is valid before saving to DB
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            organization_id = request.data.get("organization", "")
            project_id = request.data.get("project", "")

            # Check if user is member of organization and his role is OWNER or ADMIN or MEMBER
            if not OrganizationMember.objects.filter(
                organization__id=organization_id,
                member=request.user,
                role__in=[
                    ORGANIZATION_ROLES["OWNER"],
                    ORGANIZATION_ROLES["ADMIN"],
                    ORGANIZATION_ROLES["MEMBER"],
                ],
            ).exists():
                return Response(
                    {
                        "error": "You dont have permission to create content in this organization."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Check if user is member of project and his role is OWNER or ADMIN or MEMBER
            if not ProjectMember.objects.filter(
                project__id=project_id,
                member=request.user,
                role__in=[
                    PROJECT_ROLES["OWNER"],
                    PROJECT_ROLES["ADMIN"],
                    PROJECT_ROLES["MEMBER"],
                ],
            ).exists():
                return Response(
                    {
                        "error": "You dont have permission to create content in this project."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Generate content

            generator = ContentGenerator(
                open_ai_api_key=settings.OPEN_AI_API_KEY,
                pinecone_api_key=settings.PINECONE_API_KEY,
                pinecone_env=settings.PINECONE_ENV,
            )

            prompt = generator.get_prompt(
                serialized_content.data["platform"]["name"],
                serialized_content.data["category"]["name"],
                serialized_content.data["emotion"]["name"],
            )

            answer = generator.generate_content(
                prompt=prompt,
                question=serialized_content.data["description"],
                namespace=str(organization_id),
            )

            # ... Save Generated content to Genetera DB
            content_obj = serializer.save(created_by=request.user)
            serialized_content = ContentSerializer(content_obj)
            content_obj.content = answer
            content_obj.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(str(e))
            capture_exception(e)
            return Response(
                {"error": "Failed try again." + str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class ContentDetailsApiView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsContentOwner]

    def get(self, request, content_id, format=None, *args, **kwargs):
        try:
            content_obj = Content.objects.get(pk=content_id)
            serializer = ContentSerializer(content_obj)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Content.DoesNotExist:
            return Response(
                {"error": "Content not found"}, status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            capture_exception(e)
            return Response(
                {"error": "Failed, try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def delete(self, request, content_id, format=None, *args, **kwargs):
        """Delete content based on passed content id."""
        try:
            content = Content.objects.get(id=content_id)
            content.delete()
            return Response(
                {"message": "Content deleted successfully."},
                status=status.HTTP_204_NO_CONTENT,
            )
        except Content.DoesNotExist:
            return Response(
                {"error": "Content does not exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            capture_exception(e)
            return Response(
                {"error": "Failed try again"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @property
    def content_id(self):
        return self.kwargs.get("content_id", None)


class CategoriesListApiView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None, *args, **kwargs):
        """Returns all content's categories."""
        try:
            categories = ContentCategory.objects.all().order_by("name")
            serializer = ContentCategorySerializer(categories, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            capture_exception(e)
            return Response(
                {"error": "Failed try again"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class PlatformsListApiView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None, *args, **kwargs):
        """Returns all content's platforms."""
        try:
            platforms = ContentPlatform.objects.all().order_by("name")
            serializer = ContentPlatformSerializer(platforms, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            capture_exception(e)
            return Response(
                {"error": "Failed try again"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class EmotionsListApiView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None, *args, **kwargs):
        """Returns all content's emotions."""
        try:
            emotions = ContentEmotion.objects.all().order_by("name")
            serializer = ContentEmotionSerializer(emotions, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            capture_exception(e)
            return Response(
                {"error": "Failed try again"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class ContentDownloadApiView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsContentOwner]

    def post(self, request, content_id, format=None, *args, **kwargs):
        try:
            pdf_file = generate_pdf(request.data.get("content", ""))
            response = HttpResponse(pdf_file, content_type="application/pdf")
            response["Content-Disposition"] = 'filename="content.pdf"'
            return response

        except Content.DoesNotExist:
            return Response(
                {"error": "Content not found"}, status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            capture_exception(e)
            print(e)
            return Response(
                {"error": "Failed, try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @property
    def content_id(self):
        return self.kwargs.get("content_id", None)


class ContentSaveApiView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsContentOwner]

    def put(self, request, content_id, format=None, *args, **kwargs):
        """Save new updated content."""
        try:
            content = request.data.get("content", "")
            content_obj = Content.objects.get(id=content_id)
            content_obj.content = content
            content_obj.save()
            return Response(
                {"message": "Saved successfully."},
                status=status.HTTP_200_OK,
            )
        except Content.DoesNotExist:
            return Response(
                {"error": "Content does not exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            capture_exception(e)
            return Response(
                {"error": "Failed try again"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @property
    def content_id(self):
        return self.kwargs.get("content_id", None)

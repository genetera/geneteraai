from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework import status
from rest_framework.response import Response

from .models import Notification
from .serializers import NotificationSerializer


from sentry_sdk import capture_exception


class NotificationListApiView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None, *args, **kwargs):
        """Returns all notifications for loged In user ."""
        try:
            notifications = Notification.objects.filter(receiver=request.user)
            serializer = NotificationSerializer(notifications, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            capture_exception(e)
            return Response(
                {"error": "Failed try again"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

from django.urls import path
from .views import NotificationListApiView

urlpatterns = [
    path("", NotificationListApiView.as_view(), name="notifications"),
]

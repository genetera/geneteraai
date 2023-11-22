from django.urls import path
from .views import (
    SignInApiView,
    SignOutApiView,
    SignUpApiView,
    ChangePasswordApiView,
    RequestEmailVerificationApiView,
    VerifyEmailApiView,
    ForgotPasswordApiView,
    PasswordResetApiView,
    GoogleLoginApiView,
)

urlpatterns = [
    path("sign-in/", SignInApiView.as_view(), name="sign-in"),
    path("social/google/sign-in", GoogleLoginApiView.as_view(), name="google-sign-in"),
    path("sign-up/", SignUpApiView.as_view(), name="sign-up"),
    path("sign-out/", SignOutApiView.as_view(), name="sign-out"),
    path("change-password/", ChangePasswordApiView.as_view(), name="change-password"),
    path(
        "request-email-verification/",
        RequestEmailVerificationApiView.as_view(),
        name="request-email-verification",
    ),
    path("verify-email/", VerifyEmailApiView.as_view(), name="verify-email"),
    path("forgot-password/", ForgotPasswordApiView.as_view(), name="forgot-password"),
    path(
        "reset-password/<uuidb64>/<token>/",
        PasswordResetApiView.as_view(),
        name="reset-password",
    ),
]

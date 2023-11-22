from celery import shared_task

# Django imports
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

from sentry_sdk import capture_exception

# TODO


@shared_task
def organization_invitation(token: str, email: str, role: int):
    try:
        url = (
            settings.BASE_URL
            + "organization-invite/"
            + "?uuidb64="
            + str(token)
            + "&"
            + "token="
            + str(token)
        )
        from_email = settings.EMAIL_HOST_USER
        subject = f"Reset your password!"

        html_content = render_to_string(
            "authentication/emails/reset-password.html", {"reset_password_url": url}
        )
        text_content = strip_tags(html_content)

        msg = EmailMultiAlternatives(subject, text_content, from_email, [email])
        msg.attach_alternative(html_content, "text/html")
        msg.send()
        return
    except Exception as e:
        capture_exception(e)
        return

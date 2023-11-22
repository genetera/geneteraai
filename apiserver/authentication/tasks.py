from celery import shared_task

# Django imports
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

from sentry_sdk import capture_exception


@shared_task
def verify_email_task(token: str, email: str):
    try:
        url = settings.BASE_URL + "email-verification/" + "?token=" + str(token)
        from_email = settings.EMAIL_HOST_USER
        subject = f"Verify your Email!"

        html_content = render_to_string(
            "authentication/emails/email-verification.html", {"verification_url": url}
        )
        text_content = strip_tags(html_content)

        msg = EmailMultiAlternatives(subject, text_content, from_email, [email])
        msg.attach_alternative(html_content, "text/html")
        msg.send()
        return
    except Exception as e:
        capture_exception(e)
        return


@shared_task
def forgot_password_task(uuidb64: str, token: str, email: str):
    try:
        url = (
            settings.BASE_URL
            + "reset-password/"
            + "?uuidb64="
            + str(uuidb64)
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

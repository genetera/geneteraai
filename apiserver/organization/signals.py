from django.db.models.signals import pre_save, post_save
from .models import Organization

from .utils import slugify_instance_name


def organization_pre_save(sender, instance, *args, **kwargs):
    print("pre_save")
    if instance.slug is None:
        slugify_instance_name(instance, save=False)


pre_save.connect(organization_pre_save, sender=Organization)


def organization_post_save(sender, instance, created, *args, **kwargs):
    print("post_save")
    if created:
        slugify_instance_name(instance, save=True)


post_save.connect(organization_post_save, sender=Organization)

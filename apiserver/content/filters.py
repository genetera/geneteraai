from typing import List
from .utils import empty

from django.db.models import QuerySet, Q


def filter_contents(
    queryset: QuerySet,
    organizations: List[str] = [],
    projects: List[str] = [],
    categories: List[str] = [],
    platforms: List[str] = [],
    emotions: List[str] = [],
):
    """
    Filter passed content queryset based on passed filter variables.

    Args:
        queryset (Queryset): Queryset to filter from.
        organizations (List[str]): List of organizations ids to filter.
        projects (List[str]): List of projects ids to filter.
        categories (List[str]): List of categories ids to filter.
        platforms (List[str]): List of platforms ids to filter.
        emotions (List[str]): List of emotions ids to filter.
    """

    q = Q()

    if not empty(organizations):
        q &= Q(organization__id__in=organizations.split(","))

    if not empty(projects):
        q &= Q(project__id__in=projects.split(","))

    if not empty(categories):
        q &= Q(category__id__in=categories.split(","))

    if not empty(platforms):
        q &= Q(platform__id__in=platforms.split(","))

    if not empty(emotions):
        q &= Q(emotion__id__in=emotions.split(","))

    return queryset.filter(q)

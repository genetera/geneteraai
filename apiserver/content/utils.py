from typing import Union, List
from xhtml2pdf import pisa
from io import BytesIO
from weasyprint import HTML
from django.template.loader import get_template, render_to_string


def empty(var: Union[List, str]):
    """
    Check if passed variable is empty

    Args:
        var (List | str) : Variable to check if it is empty

    Returns (bool): Returns true if it is empty or false otherwise.
    """

    return len(var) == 0


def generate_pdf(html_text: str):
    try:
        return HTML(string=html_text).write_pdf()
    except Exception as e:
        pass

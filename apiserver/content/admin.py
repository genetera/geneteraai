from django.contrib import admin
from .models import Content, ContentCategory, ContentEmotion, ContentPlatform


admin.site.register(Content)
admin.site.register(ContentCategory)
admin.site.register(ContentEmotion)
admin.site.register(ContentPlatform)

# Generated by Django 3.2.9 on 2023-12-13 12:22

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('organization', '0003_auto_20231112_2229'),
    ]

    operations = [
        migrations.CreateModel(
            name='OrganizationDocument',
            fields=[
                ('id', models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('name', models.CharField(max_length=255)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now_add=True)),
                ('organization', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='organization_document', to='organization.organization')),
                ('uploaded_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='creator_organization', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Organization Document',
                'verbose_name_plural': 'Organization Documents',
                'db_table': 'organization_documents',
                'ordering': ('-created_at',),
            },
        ),
    ]

# Generated by Django 4.2.20 on 2025-03-28 08:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ecommerce', '0008_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='password',
            field=models.CharField(default=0, max_length=155),
            preserve_default=False,
        ),
    ]

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import Permission

class User(models.Model):
    username = models.CharField(max_length=155)
    email = models.CharField(max_length=155)
    password = models.CharField(max_length=155)

    

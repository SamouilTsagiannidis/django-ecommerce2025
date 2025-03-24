from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class Customer(models.Model):
    code = models.CharField(max_length=14)
    name = models.CharField(max_length=255)
    zone = models.CharField(max_length=99, blank=True)
    city = models.CharField(max_length=99, blank=True)
    address = models.CharField(max_length=255)
    zip_code = models.CharField(max_length=14)
    telephone = models.CharField(max_length=20)
    newsletter = models.BooleanField(default=False)
    added = models.DateTimeField(auto_now_add=True, blank=True)
    modified = models.DateTimeField(auto_now=True, blank=True)

class User(AbstractUser):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, null=True, blank=True, related_name='user_customer', verbose_name=_('Customer'))
    main = models.BooleanField(default=True, verbose_name=_('Main'))


from django.db import models
from ecommerce.models.Product import Product
from django.contrib.sessions.models import Session
from django.utils.translation import gettext_lazy as _

 
class CartItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, verbose_name=_('product'))
    quantity = models.IntegerField(default=1, verbose_name=_('quantity'))
    added = models.DateTimeField(auto_now_add=True, verbose_name=_('added'))
    modified = models.DateTimeField(auto_now=True, verbose_name=_('modified'))
    session = models.ForeignKey(Session, on_delete=models.SET_NULL, null=True, verbose_name=_('session'))
    

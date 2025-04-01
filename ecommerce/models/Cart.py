from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from ecommerce.models.Product import Product

class Cart(models.Model):
    """
    Represents a shopping cart, associated with a specific user.
    """
    # Link to user - OneToOne ensures one cart per user
    # Use ForeignKey if a user could potentially have multiple carts (less common)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='cart', # Allows accessing cart via user.cart
        verbose_name=_('user')
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('created at'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('updated at'))

    class Meta:
        verbose_name = _('Cart')
        verbose_name_plural = _('Carts')
        ordering = ('-created_at',)

    def __str__(self):
        return f"Cart for {self.user.username}"

    # Optional: Method to calculate total price (can also be done in serializer)
    @property
    def total_price(self):
        # items is the related_name from CartItem.cart ForeignKey
        return sum(item.get_item_total() for item in self.items.all())


class CartItem(models.Model):
    """
    Represents an item within a shopping cart.
    """
    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name='items', # Allows accessing items via cart.items
        verbose_name=_('cart')
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='cart_items', # Allows finding which carts contain a product
        verbose_name=_('product')
    )
    quantity = models.PositiveIntegerField(default=1, verbose_name=_('quantity'))
    # Optional: Store price at time of adding if product prices change
    # price_at_addition = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    class Meta:
        verbose_name = _('Cart Item')
        verbose_name_plural = _('Cart Items')
        unique_together = ('cart', 'product') # Prevent adding the same product twice to the same cart
        ordering = ('id',)

    def __str__(self):
        return f"{self.quantity} x {self.product.name} in {self.cart}"

    # Optional: Method to calculate item total (can also be done in serializer)
    def get_item_total(self):
        return self.quantity * self.product.price if self.product and self.product.price else 0
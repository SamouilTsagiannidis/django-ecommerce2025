from rest_framework import serializers
from ecommerce.models.Product import Product
from ecommerce.models.Cart import CartItem
class ProductSerializer(serializers.ModelSerializer):
    get_stock_status = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = '__all__'

class CartSerializer(serializers.ModelSerializer):
    get_cart_counter = serializers.ReadOnlyField()
    class Meta:
        model = CartItem
        fields = '__all__'
    
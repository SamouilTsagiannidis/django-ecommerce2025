from rest_framework import serializers
from ecommerce.models.Product import Product
from ecommerce.models.Cart import Cart, CartItem
from django.contrib.auth.models import User

class ProductSerializer(serializers.ModelSerializer):
    get_stock_status = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True
    )
    item_total = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ('id', 'cart', 'product', 'product_id', 'quantity', 'item_total')
        read_only_fields = ('id', 'cart', 'item_total')

    def get_item_total(self, obj):
        return obj.quantity * obj.product.price if obj.product and obj.product.price else 0

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ('id', 'user', 'items', 'total_price', 'created_at', 'updated_at')
        read_only_fields = ('id', 'user', 'created_at', 'updated_at', 'total_price')

    def get_total_price(self, obj):
        return sum(item.quantity * item.product.price for item in obj.items.all() if item.product and item.product.price)


from rest_framework import serializers
from ecommerce.models.Product import Product
from ecommerce.models.Cart import Cart
from ecommerce.models.Customer import User
class ProductSerializer(serializers.ModelSerializer):
    get_stock_status = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = '__all__'

class CartSerializer(serializers.ModelSerializer):
    get_cart_counter = serializers.ReadOnlyField()
    class Meta:
        model = Cart
        fields = '__all__'

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.get_or_create(**validated_data)
        return user
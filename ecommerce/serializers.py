from rest_framework import serializers
from ecommerce.models.Product import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
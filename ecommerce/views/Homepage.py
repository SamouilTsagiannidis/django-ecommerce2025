from rest_framework.decorators import api_view
from rest_framework.response import Response
from ecommerce.models.Product import Product
from ecommerce.serializers import ProductSerializer
from rest_framework import viewsets

from rest_framework.viewsets import ReadOnlyModelViewSet

class ProductViewSet(ReadOnlyModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
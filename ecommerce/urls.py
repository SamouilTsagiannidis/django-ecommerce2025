from django.urls import path
from .views.Checkout import product_list

urlpatterns = [
    path('api/products/', product_list, name='product-list'),
]
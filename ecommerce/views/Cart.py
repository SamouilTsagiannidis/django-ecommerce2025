from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.sessions.models import Session
from django.shortcuts import get_object_or_404
from ecommerce.models.Cart import Cart
from ecommerce.models.Product import Product
from rest_framework.viewsets import ReadOnlyModelViewSet
from ecommerce.serializers import CartSerializer

class CartViewSet(ReadOnlyModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer

    @api_view(['POST'])
    def add_to_cart(request):
        """
        Add a product to the cart.
        Authenticated users will have items linked to their user accounts.
        Unauthenticated users will have items linked via session ID.
        """
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)


        product = get_object_or_404(Product, id=product_id)

        if request.user.is_authenticated:
            cart_item, created = Cart.objects.get_or_create(
                user=request.user,
                product=product,
                defaults={'quantity': quantity}
            )
            if not created:
                cart_item.quantity += int(quantity)
                cart_item.save()
        else:
            session_id = request.session.session_key
            if not request.session.session_key:
                request.session.create()
            session_id = request.session.session_key

            cart_item, created = Cart.objects.get_or_create(
                session_id=session_id,
                product=product,
                defaults={'quantity': quantity}
            )
            if not created:
                cart_item.quantity += int(quantity)
                cart_item.save()

        return Response({"message": "Product added to cart", "cart_item_id": cart_item.id})

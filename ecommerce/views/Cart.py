from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action # Keep if needed for custom actions
from django.shortcuts import get_object_or_404
from ecommerce.models.Cart import Cart, CartItem # Assuming models
from ecommerce.models.Product import Product
from ecommerce.serializers import CartSerializer, CartItemSerializer


# Remove the standalone add_to_cart function
# @api_view(['POST'])
# def add_to_cart(request): ...


class CartViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and managing the user's cart.
    Assumes one Cart per user.
    Handles CartItems implicitly through nested actions or direct manipulation.
    """
    serializer_class = CartItemSerializer # Default for item operations
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Return only cart items belonging to the current user's cart.
        """
        user = self.request.user
        cart, _ = Cart.objects.get_or_create(user=user) # Get or create cart for user
        return CartItem.objects.filter(cart=cart)

    def get_serializer_class(self):
        """
        Use CartSerializer for list/retrieve actions on the whole cart,
        and CartItemSerializer for item-specific actions.
        """
        if self.action == 'list' or self.action == 'retrieve_cart': # Use retrieve_cart for the dedicated GET
             return CartSerializer
        return CartItemSerializer # Default for create, update, destroy

    def perform_create(self, serializer):
        """
        Associate the new CartItem with the user's cart.
        Handles adding a new product or increasing quantity of existing.
        Expects 'product_id' and 'quantity' in request data.
        """
        user = self.request.user
        cart, _ = Cart.objects.get_or_create(user=user)
        product = serializer.validated_data['product']
        quantity = serializer.validated_data.get('quantity', 1)

        # Check if item already exists
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'quantity': quantity}
        )

        if not created:
            # If item exists, just update the quantity
            cart_item.quantity += quantity
            cart_item.save()
            # Re-serialize the updated item instead of the one being created
            serializer.instance = cart_item
        else:
             # If created, associate with the cart before saving via serializer
            serializer.save(cart=cart)

    # Override list to return the single Cart object for the user
    def list(self, request, *args, **kwargs):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)

    # Add a dedicated method for retrieving the cart, distinct from listing items
    @action(detail=False, methods=['get'], url_path='details', url_name='cart-details')
    def retrieve_cart(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs) # Reuse list logic for now

    # Update (PATCH) and Destroy (DELETE) will work on CartItems by default
    # based on the default queryset and serializer_class

    # Optional: Custom action if you prefer POST /api/cart/add/
    # @action(detail=False, methods=['post'], url_path='add')
    # def add_item(self, request):
    #     serializer = self.get_serializer(data=request.data)
    #     serializer.is_valid(raise_exception=True)
    #     self.perform_create(serializer)
    #     headers = self.get_success_headers(serializer.data)
    #     return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

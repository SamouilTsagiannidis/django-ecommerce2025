from django.urls import path
from .views.Homepage import ProductViewSet
from django.conf.urls.static import static
from django.conf import settings
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from ecommerce.views.Cart import CartViewSet
from ecommerce.views.Registration import UserRegistrationView


router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'cart', CartViewSet, basename='cart')



urlpatterns = [
    path('api/', include(router.urls)),
    path('cart/add/', CartViewSet.add_to_cart, name='add_to_cart'),
    path('register', UserRegistrationView.user_register, name='user_register')

]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
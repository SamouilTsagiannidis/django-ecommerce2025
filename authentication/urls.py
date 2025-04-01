from django.urls import path
from .views import RegisterView, CustomAuthToken, LogoutView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', CustomAuthToken.as_view(), name='auth_login'),
    path('logout/', LogoutView.as_view(), name='auth_logout'),
]
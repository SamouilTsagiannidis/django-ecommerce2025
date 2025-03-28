from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@csrf_exempt  # CSRF exemption (or use more secure CSRF handling in production)
@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    # Authenticate the user
    user = authenticate(username=username, password=password)

    if user is not None:
        # If authentication is successful, generate a token
        token, created = Token.objects.get_or_create(user=user)

        # Return the token to the frontend
        return Response({
            'token': token.key
        }, status=status.HTTP_200_OK)

    else:
        # Invalid credentials
        return Response({
            'error': 'Invalid username or password'
        }, status=status.HTTP_401_UNAUTHORIZED)

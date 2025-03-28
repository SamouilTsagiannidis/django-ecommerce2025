from rest_framework.response import Response
from ecommerce.serializers import RegisterSerializer
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.decorators import api_view

class UserRegistrationView(APIView):
    
    @api_view(['POST'])
    def user_register(request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
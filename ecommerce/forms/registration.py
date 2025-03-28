from django import forms
from django_registration.forms import RegistrationForm
from ecommerce.models.Customer import User
class RegistrationForm(RegistrationForm):
    prefix = 'registration'

    def __init__(self, *args, **kwargs):
        super(RegistrationForm, self).__init__(*args, **kwargs)
        self.fields['username'].label = 'Username'
        self.fields['email'].label = 'Email'


    email = forms.EmailField(max_length=254)
    username = forms.CharField(max_length=254)

    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2')
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import User

class AuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('register')
        self.login_url = reverse('login')
        self.profile_url = reverse('profile')

    def test_user_registration_success(self):
        payload = {
            "name": "Jane Doe",
            "email": "jane@example.com",
            "password": "Password123",
            "confirm_password": "Password123"
        }
        response = self.client.post(self.register_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)
        self.assertTrue(User.objects.filter(email='jane@example.com').exists())

    def test_password_strength_validation(self):
        # Weak password (no digit or no uppercase)
        payload = {
            "name": "Jane Doe",
            "email": "jane@example.com",
            "password": "weakpassword",
            "confirm_password": "weakpassword"
        }
        response = self.client.post(self.register_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_login_success(self):
        User.objects.create_user(email="test@example.com", name="Test User", password="Password123")
        payload = {
            "email": "test@example.com",
            "password": "Password123"
        }
        response = self.client.post(self.login_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

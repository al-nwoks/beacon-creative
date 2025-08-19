import unittest
from unittest.mock import Mock, patch, AsyncMock
from sqlalchemy.orm import Session

from app.auth.providers.jwt_provider import JWTAuthProvider
from app.models.user import User


class TestJWTAuthProvider(unittest.TestCase):
    def setUp(self):
        self.provider = JWTAuthProvider()
        self.db = Mock(spec=Session)
        self.user = User(
            id=1,
            email="test@example.com",
            hashed_password="$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.PZvO.S",
            first_name="Test",
            last_name="User",
            role="client",
            is_active=True,
            is_verified=True
        )

    @patch('app.auth.providers.jwt_provider.verify_password')
    async def test_authenticate_success(self, mock_verify_password):
        # Arrange
        mock_verify_password.return_value = True
        self.db.query.return_value.filter.return_value.first.return_value = self.user
        credentials = {"email": "test@example.com", "password": "password123"}

        # Act
        result = await self.provider.authenticate(self.db, credentials)

        # Assert
        self.assertEqual(result, self.user)
        mock_verify_password.assert_called_once()

    async def test_authenticate_invalid_credentials(self):
        # Arrange
        self.db.query.return_value.filter.return_value.first.return_value = None
        credentials = {"email": "nonexistent@example.com", "password": "password123"}

        # Act
        result = await self.provider.authenticate(self.db, credentials)

        # Assert
        self.assertIsNone(result)

    @patch('app.auth.providers.jwt_provider.verify_password')
    async def test_authenticate_invalid_password(self, mock_verify_password):
        # Arrange
        mock_verify_password.return_value = False
        self.db.query.return_value.filter.return_value.first.return_value = self.user
        credentials = {"email": "test@example.com", "password": "wrongpassword"}

        # Act
        result = await self.provider.authenticate(self.db, credentials)

        # Assert
        self.assertIsNone(result)

    async def test_authenticate_inactive_user(self):
        # Arrange
        inactive_user = self.user
        inactive_user.is_active = False
        self.db.query.return_value.filter.return_value.first.return_value = inactive_user
        credentials = {"email": "test@example.com", "password": "password123"}

        # Act
        result = await self.provider.authenticate(self.db, credentials)

        # Assert
        self.assertIsNone(result)

    @patch('app.auth.providers.jwt_provider.decode_access_token')
    async def test_get_user_by_token_success(self, mock_decode_token):
        # Arrange
        mock_decode_token.return_value = {"sub": "1"}
        self.db.query.return_value.filter.return_value.first.return_value = self.user

        # Act
        result = await self.provider.get_user_by_token(self.db, "valid_token")

        # Assert
        self.assertEqual(result, self.user)
        mock_decode_token.assert_called_once_with("valid_token")

    @patch('app.auth.providers.jwt_provider.decode_access_token')
    async def test_get_user_by_token_invalid_token(self, mock_decode_token):
        # Arrange
        mock_decode_token.side_effect = Exception("Invalid token")

        # Act
        result = await self.provider.get_user_by_token(self.db, "invalid_token")

        # Assert
        self.assertIsNone(result)

    @patch('app.auth.providers.jwt_provider.create_access_token')
    async def test_create_token(self, mock_create_token):
        # Arrange
        mock_create_token.return_value = "generated_token"

        # Act
        result = await self.provider.create_token(self.user)

        # Assert
        self.assertEqual(result, "generated_token")
        mock_create_token.assert_called_once_with(subject="1")

    @patch('app.auth.providers.jwt_provider.decode_access_token')
    async def test_validate_token_valid(self, mock_decode_token):
        # Arrange
        mock_decode_token.return_value = {"sub": "1"}

        # Act
        result = await self.provider.validate_token("valid_token")

        # Assert
        self.assertTrue(result)

    @patch('app.auth.providers.jwt_provider.decode_access_token')
    async def test_validate_token_invalid(self, mock_decode_token):
        # Arrange
        mock_decode_token.side_effect = Exception("Invalid token")

        # Act
        result = await self.provider.validate_token("invalid_token")

        # Assert
        self.assertFalse(result)


if __name__ == '__main__':
    unittest.main()
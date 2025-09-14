import unittest
from unittest.mock import Mock, patch, AsyncMock
from sqlalchemy.orm import Session
import sys
import os

# Add the backend directory to the path so we can import the app modules
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

from app.models.user import User, UserRole
from app.models.gig import Gig
from app.models.application import Application
from app.auth.providers.jwt_provider import JWTAuthProvider
from app.api.endpoints import gigs, applications


class TestUserJourneys(unittest.TestCase):
    def setUp(self):
        self.db = Mock(spec=Session)
        self.provider = JWTAuthProvider()
        
        # Create mock users for each role
        self.creative_user = User(
            id=1,
            email="creative@example.com",
            hashed_password="$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.PZvO.S",
            first_name="Creative",
            last_name="User",
            role=UserRole.creative,
            is_active=True,
            is_verified=True
        )
        
        self.client_user = User(
            id=2,
            email="client@example.com",
            hashed_password="$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.PZvO.S",
            first_name="Client",
            last_name="User",
            role=UserRole.client,
            is_active=True,
            is_verified=True
        )
        
        self.admin_user = User(
            id=3,
            email="admin@example.com",
            hashed_password="$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.PZvO.S",
            first_name="Admin",
            last_name="User",
            role=UserRole.admin,
            is_active=True,
            is_verified=True
        )
        
        # Create a mock gig
        self.mock_gig = Gig(
            id="123e4567-e89b-12d3-a456-426614174000",
            client_id=2,
            title="Test Gig",
            description="Test gig description",
            category="Design",
            budget_min=100.0,
            budget_max=500.0,
            timeline_weeks=2,
            required_skills=["Design", "Photoshop"],
            status="active"
        )
        
        # Create a mock application
        self.mock_application = Application(
            id="123e4567-e89b-12d3-a456-426614174001",
            gig_id="123e4567-e89b-12d3-a456-426614174000",
            creative_id=1,
            cover_letter="I'm interested in this gig",
            proposed_budget=300.0,
            proposed_timeline_weeks=2,
            status="pending"
        )

    def test_user_roles(self):
        """Test that user roles are correctly defined"""
        self.assertEqual(self.creative_user.role, UserRole.creative)
        self.assertEqual(self.client_user.role, UserRole.client)
        self.assertEqual(self.admin_user.role, UserRole.admin)

    @patch('app.auth.providers.jwt_provider.verify_password')
    async def test_authenticate_creative_user(self, mock_verify_password):
        """Test authentication for creative user"""
        mock_verify_password.return_value = True
        self.db.query.return_value.filter.return_value.first.return_value = self.creative_user
        credentials = {"email": "creative@example.com", "password": "password123"}
        
        result = await self.provider.authenticate(self.db, credentials)
        self.assertEqual(result, self.creative_user)
        self.assertEqual(result.role, UserRole.creative)

    @patch('app.auth.providers.jwt_provider.verify_password')
    async def test_authenticate_client_user(self, mock_verify_password):
        """Test authentication for client user"""
        mock_verify_password.return_value = True
        self.db.query.return_value.filter.return_value.first.return_value = self.client_user
        credentials = {"email": "client@example.com", "password": "password123"}
        
        result = await self.provider.authenticate(self.db, credentials)
        self.assertEqual(result, self.client_user)
        self.assertEqual(result.role, UserRole.client)

    @patch('app.auth.providers.jwt_provider.verify_password')
    async def test_authenticate_admin_user(self, mock_verify_password):
        """Test authentication for admin user"""
        mock_verify_password.return_value = True
        self.db.query.return_value.filter.return_value.first.return_value = self.admin_user
        credentials = {"email": "admin@example.com", "password": "password123"}
        
        result = await self.provider.authenticate(self.db, credentials)
        self.assertEqual(result, self.admin_user)
        self.assertEqual(result.role, UserRole.admin)

    def test_creative_cannot_create_gig(self):
        """Test that creative users cannot create gigs"""
        # This test would verify that the create_gig endpoint rejects requests from creative users
        # In the actual implementation, this is handled by the get_current_client_user_dependency
        pass

    def test_client_can_create_gig(self):
        """Test that client users can create gigs"""
        # This test would verify that the create_gig endpoint accepts requests from client users
        # In the actual implementation, this is handled by the get_current_client_user_dependency
        pass

    def test_creative_can_apply_for_gig(self):
        """Test that creative users can apply for gigs"""
        # This test would verify that the create_application endpoint accepts requests from creative users
        # In the actual implementation, this is handled by the get_current_creative_user dependency
        pass

    def test_client_cannot_apply_for_gig(self):
        """Test that client users cannot apply for gigs"""
        # This test would verify that the create_application endpoint rejects requests from client users
        # In the actual implementation, this is handled by the get_current_creative_user dependency
        pass

    def test_gig_creation_workflow(self):
        """Test the complete gig creation workflow for clients"""
        # This would test the full flow from client creating a gig to it being stored in the database
        pass

    def test_application_submission_workflow(self):
        """Test the complete application submission workflow for creatives"""
        # This would test the full flow from creative applying to a gig to the application being stored
        pass

    def test_application_review_workflow(self):
        """Test the application review workflow for clients"""
        # This would test how clients can review and accept/reject applications
        pass

    def test_role_based_dashboard_access(self):
        """Test that users can only access their appropriate dashboards"""
        # This would verify that creative users are redirected to /creative
        # and client users are redirected to /client after login
        pass


if __name__ == '__main__':
    unittest.main()
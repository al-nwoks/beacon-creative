#!/usr/bin/env python3
"""
Test runner for user journey tests
"""

import unittest
import sys
import os

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(__file__))

from test_user_journeys import TestUserJourneys
from test_role_based_access import TestRoleBasedAccess


def run_tests():
    """Run all user journey tests"""
    # Create a test suite
    suite = unittest.TestSuite()
    
    # Add tests from TestUserJourneys
    suite.addTest(unittest.makeSuite(TestUserJourneys))
    
    # Add tests from TestRoleBasedAccess
    suite.addTest(unittest.makeSuite(TestRoleBasedAccess))
    
    # Create a test runner
    runner = unittest.TextTestRunner(verbosity=2)
    
    # Run the tests
    result = runner.run(suite)
    
    # Return exit code based on test results
    return 0 if result.wasSuccessful() else 1


if __name__ == '__main__':
    exit_code = run_tests()
    sys.exit(exit_code)
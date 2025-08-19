#!/bin/bash

# B3ACON Creative Connect Setup Script
echo "🚀 Setting up B3ACON Creative Connect..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18.17.0 or later."
        exit 1
    fi
    
    # Check Python
    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 is not installed. Please install Python 3.11 or later."
        exit 1
    fi
    
    # Check Docker (optional)
    if ! command -v docker &> /dev/null; then
        print_warning "Docker is not installed. You can still run the project locally."
    fi
    
    print_success "All requirements met!"
}

# Setup backend
setup_backend() {
    print_status "Setting up backend..."
    
    cd backend
    
    # Create virtual environment
    print_status "Creating Python virtual environment..."
    python3 -m venv venv
    
    # Activate virtual environment
    source venv/bin/activate
    
    # Install dependencies
    print_status "Installing Python dependencies..."
    pip install -r requirements.txt
    
    # Copy environment file
    if [ ! -f .env ]; then
        print_status "Creating backend .env file..."
        cp .env.example .env
        print_warning "Please update the .env file with your actual configuration values."
    fi
    
    # Run database migrations
    print_status "Running database migrations..."
    alembic upgrade head || print_warning "Database migrations failed. Make sure PostgreSQL is running and configured."
    
    cd ..
    print_success "Backend setup complete!"
}

# Setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    
    cd frontend
    
    # Install dependencies
    print_status "Installing Node.js dependencies..."
    npm install
    
    # Copy environment file
    if [ ! -f .env.local ]; then
        print_status "Creating frontend .env.local file..."
        cp .env.local.example .env.local
        print_warning "Please update the .env.local file with your actual configuration values."
    fi
    
    cd ..
    print_success "Frontend setup complete!"
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    # Check if PostgreSQL is running
    if ! pg_isready &> /dev/null; then
        print_warning "PostgreSQL is not running. Please start PostgreSQL service."
        print_status "You can also use Docker to run PostgreSQL:"
        echo "docker run --name beacon-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=beacon -p 5432:5432 -d postgres:15-alpine"
        return
    fi
    
    # Create database if it doesn't exist
    print_status "Creating database..."
    createdb beacon 2>/dev/null || print_warning "Database 'beacon' already exists or could not be created."
    
    print_success "Database setup complete!"
}

# Start development servers
start_dev_servers() {
    print_status "Starting development servers..."
    
    # Make scripts executable
    chmod +x start-dev.sh
    chmod +x backend/start-dev.sh
    chmod +x frontend/start-dev.sh
    
    print_success "Development scripts are ready!"
    print_status "To start the development servers:"
    echo "  - Full stack: ./start-dev.sh"
    echo "  - Backend only: ./backend/start-dev.sh"
    echo "  - Frontend only: ./frontend/start-dev.sh"
}

# Docker setup
setup_docker() {
    if command -v docker &> /dev/null; then
        print_status "Setting up Docker..."
        
        # Make docker script executable
        chmod +x docker-start.sh
        
        print_success "Docker setup complete!"
        print_status "To start with Docker: ./docker-start.sh"
    fi
}

# Main setup process
main() {
    echo "🎨 B3ACON Creative Connect - Full Stack Setup"
    echo "=============================================="
    
    check_requirements
    setup_backend
    setup_frontend
    setup_database
    start_dev_servers
    setup_docker
    
    echo ""
    echo "🎉 Setup complete!"
    echo ""
    print_success "Your B3ACON Creative Connect application is ready!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Update environment files with your configuration"
    echo "2. Start the development servers:"
    echo "   ./start-dev.sh"
    echo ""
    echo "🌐 Access your application:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend API: http://localhost:8000"
    echo "   API Docs: http://localhost:8000/api/v1/docs"
    echo ""
    echo "👥 Test accounts (when MOCK_MODE=true):"
    echo "   Creative: sarah.johnson@example.com / password123"
    echo "   Client: john.smith@stylemagzine.com / password123"
    echo ""
    print_status "Happy coding! 🚀"
}

# Run main function
main
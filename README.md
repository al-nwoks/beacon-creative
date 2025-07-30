# B3ACON Creative Connect

B3ACON Creative Connect is a comprehensive platform that connects creative professionals with clients through project management, collaboration, and discovery tools. Built with modern technologies and following best practices for scalability and maintainability.

## 🎨 Features

### For Creatives
- **Creative Dashboard**: Browse and apply to featured jobs with a beautiful, mobile-first interface
- **Profile Management**: Showcase skills, portfolio, and experience
- **Application Tracking**: Monitor application status and communicate with clients
- **Portfolio Integration**: Link external portfolios and showcase work

### For Clients
- **Client Dashboard**: Post projects and manage applications
- **Talent Discovery**: Browse and search for creative professionals
- **Project Management**: Track project progress and milestones
- **Secure Payments**: Escrow-based payment system with Stripe integration

### For Admins
- **Admin Dashboard**: Comprehensive platform management
- **User Management**: Verify, suspend, and manage user accounts
- **Analytics**: Platform statistics and growth metrics
- **Content Moderation**: Review and manage projects and users

## 🏗️ Architecture

### Backend (FastAPI)
- **Modern Python**: FastAPI with async support
- **Database**: PostgreSQL with SQLAlchemy ORM and Alembic migrations
- **Authentication**: JWT-based with role-based access control
- **API Documentation**: Auto-generated OpenAPI/Swagger docs
- **Mock Data**: Comprehensive seeding system for development
- **Database Migrations**: Alembic for schema versioning and deployment

### Frontend (Next.js)
- **React 18**: Latest React with Next.js 14 App Router
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first CSS with custom design system
- **Shared Components**: Modular, reusable component library
- **Responsive Design**: Mobile-first approach with consistent UX

### Design System
- **Purple Color Scheme**: Consistent branding across all interfaces
- **Component Library**: Shared JobCard, CreativeCard, Header, and Navigation components
- **Accessibility**: WCAG compliant with proper ARIA labels
- **Mobile Navigation**: Bottom navigation for mobile devices

## 🚀 Quick Start

### Prerequisites
- Node.js 18.17.0 or later
- Python 3.11 or later
- PostgreSQL 15 or later
- Docker (optional)

### Automated Setup
```bash
# Clone the repository
git clone <repository-url>
cd beacon

# Run the setup script
chmod +x setup.sh
./setup.sh

# Start development servers
./start-dev.sh
```

### Manual Setup

#### Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
alembic upgrade head

# Start the server
uvicorn app.main:app --reload
```

#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Setup environment
cp .env.local.example .env.local
# Edit .env.local with your configuration

# Start the development server
npm run dev
```

### Docker Setup
```bash
# Start with Docker
chmod +x docker-start.sh
./docker-start.sh
```

## 🎯 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api/v1/docs

### Test Accounts
When `MOCK_MODE=true` is enabled, use these test accounts:

**Creative Users:**
- Email: `sarah.johnson@example.com`
- Password: `password123`
- Dashboard: `/creative-dashboard`

**Client Users:**
- Email: `john.smith@stylemagzine.com`
- Password: `password123`
- Dashboard: `/dashboard`

**Admin Users:**
- Email: `admin@beacon-connect.com`
- Password: `admin123`
- Dashboard: `/admin`

When `MOCK_MODE=false` but `SEED_DATA=true` is enabled, only the admin user is created:
- Email: `admin@beacon-connect.com`
- Password: `admin123`
- Dashboard: `/admin`

## 📱 User Interfaces

### Creative Dashboard
- **Purple gradient welcome banner** with profile completion prompt
- **Featured jobs section** with apply functionality
- **Top creators showcase** with verification badges
- **Mobile-optimized** with bottom navigation
- **Real-time search** and filtering capabilities

### Client Dashboard
- **Project management** with statistics overview
- **Quick actions** for posting projects and browsing talent
- **Application tracking** with status indicators
- **Revenue and analytics** dashboard
- **Recommended creatives** section

### Admin Dashboard
- **Platform statistics** with user and project metrics
- **User management** with verification and suspension controls
- **Project oversight** with approval workflows
- **Revenue tracking** and growth analytics
- **Quick action buttons** for common admin tasks

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/beacon

# Authentication
JWT_SECRET_KEY=your-jwt-secret-key
JWT_ALGORITHM=HS256
JWT_EXPIRATION_TIME=3600

# Mock Data (Development)
MOCK_MODE=true
SEED_DATA=true

# External Services
STRIPE_SECRET_KEY=sk_test_your_stripe_key
SENDGRID_API_KEY=your-sendgrid-api-key
AWS_ACCESS_KEY_ID=your-aws-access-key
```

#### Frontend (.env.local)
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# App Configuration
NEXT_PUBLIC_APP_NAME=B3ACON Creative Connect
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Feature Flags
NEXT_PUBLIC_ENABLE_PAYMENTS=true
NEXT_PUBLIC_ENABLE_MESSAGING=true
```

## 🎨 Design System

### Color Palette
```css
/* Primary Colors */
--beacon-blue: #2563EB;
--beacon-blue-dark: #1D4ED8;
--beacon-blue-light: #60A5FA;

/* Secondary Colors */
--beacon-purple: #7C3AED;
--beacon-green: #059669;
--beacon-orange: #EA580C;
--beacon-red: #DC2626;
```

### Component Library
- **JobCard**: Displays project information with apply functionality
- **CreativeCard**: Shows creative profiles with contact options
- **Header**: Responsive navigation with search and user actions
- **BottomNavigation**: Mobile navigation for different user types
- **Button**: Consistent button styles with variants
- **Input**: Form inputs with validation and error states

## 🔐 Authentication & Authorization

### User Types
- **Creative**: Can browse jobs, apply to projects, manage profile
- **Client**: Can post projects, browse talent, manage applications
- **Admin**: Full platform access with user and content management

### Security Features
- JWT token-based authentication
- Role-based access control (RBAC)
- Password hashing with bcrypt
- CORS protection
- Input validation and sanitization

## 🗄️ Database Migrations

### Alembic Setup
The project uses Alembic for database schema versioning and migrations. All database changes should be managed through migrations rather than direct schema modifications.

### Migration Commands
```bash
# Navigate to backend directory
cd backend

# Create a new migration after model changes
alembic revision --autogenerate -m "Description of changes"

# Apply migrations to database
alembic upgrade head

# Downgrade to previous migration
alembic downgrade -1

# View migration history
alembic history

# View current migration version
alembic current
```

### Initial Setup
The project includes an initial migration (`001_initial_migration.py`) that creates all the base tables:
- `users` - User accounts with role-based access (id: INTEGER primary key)
- `projects` - Client project postings (id: INTEGER primary key, client_id: INTEGER foreign key)
- `applications` - Creative applications to projects (id: INTEGER primary key, project_id: INTEGER foreign key, creative_id: INTEGER foreign key)
- `messages` - Communication between users (id: INTEGER primary key, sender_id: INTEGER foreign key, recipient_id: INTEGER foreign key)
- `payments` - Payment tracking and processing (id: INTEGER primary key, project_id: INTEGER foreign key)
- `project_files` - File attachments and deliverables (id: UUID primary key, project_id: UUID foreign key)

### Development Workflow
1. Make changes to SQLAlchemy models in `app/models/`
2. Generate migration: `alembic revision --autogenerate -m "Description"`
3. Review the generated migration file
4. Apply migration: `alembic upgrade head`
5. Test the changes thoroughly

### Production Deployment
Migrations are automatically run during deployment via the setup scripts:
- `setup.sh` runs `alembic upgrade head` during initial setup
- `backend/start-dev.sh` runs migrations before starting the server
- Always backup your database before running migrations in production

## 📊 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login

### Projects
- `GET /api/v1/projects/` - List projects with filtering
- `POST /api/v1/projects/` - Create new project (clients only)
- `GET /api/v1/projects/{id}` - Get project details
- `PUT /api/v1/projects/{id}` - Update project

### Applications
- `POST /api/v1/applications/` - Apply to project (creatives only)
- `GET /api/v1/applications/me` - Get user's applications
- `PUT /api/v1/applications/{id}` - Update application status

### Users
- `GET /api/v1/users/me` - Get current user profile
- `PUT /api/v1/users/me` - Update user profile
- `POST /api/v1/users/upload-avatar` - Upload profile picture

## 🧪 Testing

### Running Tests
```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

### Test Data
The application includes comprehensive mock data seeding:
- 9 test users (5 creatives, 4 clients)
- 6 sample projects across different categories
- 5 job applications with various statuses
- Realistic data matching the reference design

## 🚀 Deployment

### Production Setup
1. Set up PostgreSQL database
2. Configure environment variables
3. Build and deploy backend API
4. Build and deploy frontend application
5. Set up reverse proxy (nginx)
6. Configure SSL certificates

### Docker Production
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

### Code Style
- **Backend**: Follow PEP 8 with Black formatting
- **Frontend**: ESLint + Prettier configuration
- **Commits**: Conventional commit messages
- **Documentation**: Update README for new features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/api/v1/docs`
- Review the design system documentation

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ User authentication and authorization
- ✅ Project posting and application system
- ✅ Creative and client dashboards
- ✅ Admin panel with user management
- ✅ Mobile-responsive design

### Phase 2 (Planned)
- 🔄 Real-time messaging system
- 🔄 File upload and portfolio management
- 🔄 Payment processing with Stripe
- 🔄 Advanced search and filtering
- 🔄 Email notifications

### Phase 3 (Future)
- 📋 Video calling integration
- 📋 Advanced analytics dashboard
- 📋 Mobile app development
- 📋 API rate limiting
- 📋 Advanced security features

---

Built with ❤️ by the B3ACON team

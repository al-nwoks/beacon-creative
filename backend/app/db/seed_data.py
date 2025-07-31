from sqlalchemy.orm import Session
from app.models.user import User
from app.models.project import Project
from app.models.application import Application
from app.models.message import Message
from app.models.payment import Payment
from app.models.project_file import ProjectFile
from app.auth.password import get_password_hash
import uuid
from datetime import datetime, timedelta

def seed_admin_user(db: Session):
    """Seed the database with just the admin user"""
    
    # Check if admin user already exists
    admin_user = db.query(User).filter(User.email == "admin@beacon-connect.com").first()
    if admin_user:
        print("Admin user already exists, skipping...")
        return
    
    # Create admin user
    admin_data = {
        "email": "admin@beacon-connect.com",
        "hashed_password": get_password_hash("admin123"),
        "first_name": "Admin",
        "last_name": "User",
        "role": "admin",  # This matches the role enum in the migration
        "is_verified": True,
        "is_active": True
    }
    
    admin_user = User(**admin_data)
    db.add(admin_user)
    db.commit()
    db.refresh(admin_user)
    
    print("Admin user seeded successfully!")

def seed_mock_data(db: Session):
    """Seed the database with mock data for development and testing"""
    
    # Clear existing data
    db.query(Payment).delete()
    db.query(ProjectFile).delete()
    db.query(Message).delete()
    db.query(Application).delete()
    db.query(Project).delete()
    db.query(User).delete()
    db.commit()
    
    # Create mock users
    users_data = [
        # Creatives
        {
            "email": "sarah.johnson@example.com",
            "hashed_password": get_password_hash("password123"),
            "first_name": "Sarah",
            "last_name": "Johnson",
            "role": "creative",
            "bio": "Passionate photographer with 8+ years of experience in fashion and portrait photography. I specialize in creating stunning visual narratives that capture the essence of brands and individuals.",
            "hourly_rate": 75.0,
            "location": "New York, NY",
            "skills": ["Photography", "Fashion", "Portrait", "Studio", "Retouching"],
            "portfolio_links": ["https://sarahjohnson.com", "https://instagram.com/sarahj_photo"],
            "is_verified": True,
            "is_active": True
        },
        {
            "email": "mike.chen@example.com",
            "hashed_password": get_password_hash("password123"),
            "first_name": "Mike",
            "last_name": "Chen",
            "role": "creative",
            "bio": "Creative director and graphic designer with expertise in brand identity, web design, and digital marketing. I help businesses tell their story through compelling visual design.",
            "hourly_rate": 85.0,
            "location": "San Francisco, CA",
            "skills": ["Graphic Design", "Branding", "Web Design", "UI/UX", "Adobe Creative Suite"],
            "portfolio_links": ["https://mikechen.design", "https://behance.net/mikechen"],
            "is_verified": True,
            "is_active": True
        },
        {
            "email": "emma.davis@example.com",
            "hashed_password": get_password_hash("password123"),
            "first_name": "Emma",
            "last_name": "Davis",
            "role": "creative",
            "bio": "Professional model and content creator specializing in fashion, lifestyle, and commercial work. Available for photo shoots, runway shows, and brand collaborations.",
            "hourly_rate": 120.0,
            "location": "Los Angeles, CA",
            "skills": ["Modeling", "Fashion", "Commercial", "Lifestyle", "Content Creation"],
            "portfolio_links": ["https://emmadavis.model", "https://instagram.com/emma_davis_model"],
            "is_verified": True,
            "is_active": True
        },
        {
            "email": "alex.rodriguez@example.com",
            "hashed_password": get_password_hash("password123"),
            "first_name": "Alex",
            "last_name": "Rodriguez",
            "role": "creative",
            "bio": "Professional DJ and music producer with 10+ years of experience in electronic music, events, and brand activations. I create unforgettable musical experiences.",
            "hourly_rate": 200.0,
            "location": "Miami, FL",
            "skills": ["DJ", "Music Production", "Events", "Electronic Music", "Sound Design"],
            "portfolio_links": ["https://alexrodriguezdj.com", "https://soundcloud.com/alexrodriguez"],
            "is_verified": True,
            "is_active": True
        },
        {
            "email": "lisa.wang@example.com",
            "hashed_password": get_password_hash("password123"),
            "first_name": "Lisa",
            "last_name": "Wang",
            "role": "creative",
            "bio": "Award-winning videographer and filmmaker specializing in corporate videos, documentaries, and creative storytelling. I bring brands to life through compelling video content.",
            "hourly_rate": 95.0,
            "location": "Austin, TX",
            "skills": ["Videography", "Filmmaking", "Editing", "Storytelling", "Corporate Video"],
            "portfolio_links": ["https://lisawangfilms.com", "https://vimeo.com/lisawang"],
            "is_verified": True,
            "is_active": True
        },
        
        # Clients
        {
            "email": "john.smith@stylemagzine.com",
            "hashed_password": get_password_hash("password123"),
            "first_name": "John",
            "last_name": "Smith",
            "role": "client",
            "bio": "Creative Director at Style Magazine. Always looking for talented photographers and models for our fashion shoots and editorial content.",
            "location": "New York, NY",
            "is_verified": True,
            "is_active": True
        },
        {
            "email": "maria.gonzalez@beachvibes.com",
            "hashed_password": get_password_hash("password123"),
            "first_name": "Maria",
            "last_name": "Gonzalez",
            "role": "client",
            "bio": "Marketing Manager at Beach Vibes. We create lifestyle content and need creative professionals for our summer campaigns and brand collaborations.",
            "location": "Los Angeles, CA",
            "is_verified": True,
            "is_active": True
        },
        {
            "email": "david.kim@runwayproductions.com",
            "hashed_password": get_password_hash("password123"),
            "first_name": "David",
            "last_name": "Kim",
            "role": "client",
            "bio": "Event Producer at Runway Productions. We organize high-end fashion shows and events, always seeking talented DJs, photographers, and creative professionals.",
            "location": "Miami, FL",
            "is_verified": True,
            "is_active": True
        },
        {
            "email": "jennifer.brown@techstartup.com",
            "hashed_password": get_password_hash("password123"),
            "first_name": "Jennifer",
            "last_name": "Brown",
            "role": "client",
            "bio": "Head of Marketing at TechStartup Inc. We need creative professionals for our product launches, brand campaigns, and corporate content creation.",
            "location": "San Francisco, CA",
            "is_verified": True,
            "is_active": True
        }
    ]
    
    # Create users
    created_users = []
    for user_data in users_data:
        user = User(**user_data)
        db.add(user)
        created_users.append(user)
    
    db.commit()
    
    # Refresh users to get IDs
    for user in created_users:
        db.refresh(user)
    
    # Get specific users for projects
    style_magazine = next(u for u in created_users if u.email == "john.smith@stylemagzine.com")
    beach_vibes = next(u for u in created_users if u.email == "maria.gonzalez@beachvibes.com")
    runway_productions = next(u for u in created_users if u.email == "david.kim@runwayproductions.com")
    tech_startup = next(u for u in created_users if u.email == "jennifer.brown@techstartup.com")
    
    # Create mock projects
    projects_data = [
        {
            "client_id": style_magazine.id,
            "title": "Fashion Photographer Needed",
            "description": "We're looking for a talented fashion photographer for our upcoming spring collection shoot. The project involves studio photography with professional models, focusing on high-end fashion pieces. Experience with fashion photography and studio lighting is essential.",
            "category": "Photography",
            "budget_min": 500.0,
            "budget_max": 750.0,
            "timeline_weeks": 1,
            "required_skills": ["Photography", "Fashion", "Studio"],
            "status": "active",
            "created_at": datetime.utcnow() - timedelta(days=2)
        },
        {
            "client_id": beach_vibes.id,
            "title": "Model for Summer Campaign",
            "description": "Beach Vibes is casting models for our summer lifestyle campaign. We're looking for energetic, beach-ready models who can embody our brand's fun and adventurous spirit. The shoot will take place at various beach locations in California.",
            "category": "Modeling",
            "budget_min": 1000.0,
            "budget_max": 1500.0,
            "timeline_weeks": 2,
            "required_skills": ["Modeling", "Summer", "Outdoor", "Lifestyle"],
            "status": "active",
            "created_at": datetime.utcnow() - timedelta(days=1)
        },
        {
            "client_id": runway_productions.id,
            "title": "DJ for Fashion Show After-Party",
            "description": "We need an experienced DJ for our exclusive fashion show after-party in Miami. The event will host 200+ VIP guests and requires someone who can read the crowd and keep the energy high throughout the night. Electronic and house music preferred.",
            "category": "Music",
            "budget_min": 800.0,
            "budget_max": 1200.0,
            "timeline_weeks": 3,
            "required_skills": ["DJ", "Music", "Events", "Electronic"],
            "status": "active",
            "created_at": datetime.utcnow() - timedelta(days=5)
        },
        {
            "client_id": tech_startup.id,
            "title": "Brand Identity Designer",
            "description": "TechStartup Inc. is looking for a creative designer to develop our complete brand identity. This includes logo design, color palette, typography, and brand guidelines. We need someone who understands tech industry aesthetics and can create a modern, professional look.",
            "category": "Design",
            "budget_min": 2000.0,
            "budget_max": 3500.0,
            "timeline_weeks": 4,
            "required_skills": ["Graphic Design", "Branding", "Logo Design", "Brand Guidelines"],
            "status": "active",
            "created_at": datetime.utcnow() - timedelta(days=3)
        },
        {
            "client_id": style_magazine.id,
            "title": "Video Content Creator",
            "description": "Style Magazine is expanding into video content and needs a skilled videographer to create behind-the-scenes content, interviews, and promotional videos. Must have experience with fashion industry content and social media optimization.",
            "category": "Video",
            "budget_min": 1500.0,
            "budget_max": 2500.0,
            "timeline_weeks": 6,
            "required_skills": ["Videography", "Content Creation", "Social Media", "Fashion"],
            "status": "active",
            "created_at": datetime.utcnow() - timedelta(days=4)
        },
        {
            "client_id": beach_vibes.id,
            "title": "Product Photography",
            "description": "We need high-quality product photography for our new swimwear line. The photographer should have experience with product photography, lighting, and post-processing. Studio and lifestyle shots required.",
            "category": "Photography",
            "budget_min": 800.0,
            "budget_max": 1200.0,
            "timeline_weeks": 2,
            "required_skills": ["Photography", "Product Photography", "Retouching", "Studio"],
            "status": "active",
            "created_at": datetime.utcnow() - timedelta(days=6)
        }
    ]
    
    # Create projects
    created_projects = []
    for project_data in projects_data:
        project = Project(**project_data)
        db.add(project)
        created_projects.append(project)
    
    db.commit()
    
    # Refresh projects to get IDs
    for project in created_projects:
        db.refresh(project)
    
    # Get creative users for applications
    sarah = next(u for u in created_users if u.email == "sarah.johnson@example.com")
    mike = next(u for u in created_users if u.email == "mike.chen@example.com")
    emma = next(u for u in created_users if u.email == "emma.davis@example.com")
    alex = next(u for u in created_users if u.email == "alex.rodriguez@example.com")
    lisa = next(u for u in created_users if u.email == "lisa.wang@example.com")
    
    # Create mock applications
    applications_data = [
        {
            "project_id": created_projects[0].id,  # Fashion Photographer
            "creative_id": sarah.id,
            "cover_letter": "I'm excited to apply for this fashion photography project. With over 8 years of experience in fashion photography, I have worked with numerous brands and magazines. My portfolio showcases my ability to capture the essence of fashion pieces while maintaining the highest quality standards. I'm confident I can deliver exceptional results for your spring collection shoot.",
            "proposed_budget": 650.0,
            "proposed_timeline_weeks": 1,
            "status": "pending",
            "created_at": datetime.utcnow() - timedelta(hours=12)
        },
        {
            "project_id": created_projects[1].id,  # Model for Summer Campaign
            "creative_id": emma.id,
            "cover_letter": "I would love to be part of Beach Vibes' summer campaign! As a professional model with extensive experience in lifestyle and outdoor shoots, I understand how to embody a brand's spirit and connect with the target audience. My portfolio includes similar beach and lifestyle campaigns that align perfectly with your brand aesthetic.",
            "proposed_budget": 1200.0,
            "proposed_timeline_weeks": 2,
            "status": "pending",
            "created_at": datetime.utcnow() - timedelta(hours=8)
        },
        {
            "project_id": created_projects[2].id,  # DJ for Fashion Show
            "creative_id": alex.id,
            "cover_letter": "I'm thrilled about the opportunity to DJ your fashion show after-party! With 10+ years of experience in high-end events and a deep understanding of electronic music, I know how to create the perfect atmosphere for VIP guests. I've performed at similar fashion events in Miami and always deliver an unforgettable experience.",
            "proposed_budget": 1000.0,
            "proposed_timeline_weeks": 3,
            "status": "accepted",
            "created_at": datetime.utcnow() - timedelta(hours=24)
        },
        {
            "project_id": created_projects[3].id,  # Brand Identity Designer
            "creative_id": mike.id,
            "cover_letter": "I'm excited to help TechStartup Inc. develop a compelling brand identity. My experience in tech industry branding and understanding of modern design trends makes me the perfect fit for this project. I'll create a comprehensive brand system that reflects your company's innovation and professionalism while standing out in the competitive tech market.",
            "proposed_budget": 2800.0,
            "proposed_timeline_weeks": 4,
            "status": "pending",
            "created_at": datetime.utcnow() - timedelta(hours=6)
        },
        {
            "project_id": created_projects[4].id,  # Video Content Creator
            "creative_id": lisa.id,
            "cover_letter": "I'm passionate about creating engaging video content for fashion brands. My experience in storytelling and understanding of social media trends will help Style Magazine create compelling video content that resonates with your audience. I'm excited to bring your brand stories to life through creative videography.",
            "proposed_budget": 2000.0,
            "proposed_timeline_weeks": 6,
            "status": "pending",
            "created_at": datetime.utcnow() - timedelta(hours=4)
        }
    ]
    
    # Create applications
    for app_data in applications_data:
        application = Application(**app_data)
        db.add(application)
    
    db.commit()
    
    print("Mock data seeded successfully!")
    print(f"Created {len(created_users)} users")
    print(f"Created {len(created_projects)} projects")
    print(f"Created {len(applications_data)} applications")
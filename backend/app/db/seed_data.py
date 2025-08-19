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
            "is_active": True,
            "creative_type": "Photographer"
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
            "is_active": True,
            "creative_type": "Designer"
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
            "is_active": True,
            "creative_type": "Model"
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
            "is_active": True,
            "creative_type": "DJ"
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
            "is_active": True,
            "creative_type": "Videographer"
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
    
    # Create mock messages
    messages_data = [
        # Conversation between Sarah (creative) and Style Magazine (client) about Fashion Photographer project
        {
            "sender_id": style_magazine.id,
            "recipient_id": sarah.id,
            "project_id": created_projects[0].id,
            "content": "Hi Sarah, I'm interested in your application for our fashion photography project. Could you tell me more about your experience with studio lighting?",
            "is_read": True,
            "created_at": datetime.utcnow() - timedelta(hours=11)
        },
        {
            "sender_id": sarah.id,
            "recipient_id": style_magazine.id,
            "project_id": created_projects[0].id,
            "content": "Hi John, I'd be happy to discuss my experience! I've been working with studio lighting for over 6 years, specializing in fashion photography. I have a full setup with Profoto lights and modifiers. Would you like to see some examples from my portfolio?",
            "is_read": True,
            "created_at": datetime.utcnow() - timedelta(hours=10)
        },
        {
            "sender_id": style_magazine.id,
            "recipient_id": sarah.id,
            "project_id": created_projects[0].id,
            "content": "Yes, that would be great! Please share some portfolio examples that are similar to what we're looking for.",
            "is_read": True,
            "created_at": datetime.utcnow() - timedelta(hours=9)
        },
        
        # Conversation between Emma (creative) and Beach Vibes (client) about Summer Campaign
        {
            "sender_id": beach_vibes.id,
            "recipient_id": emma.id,
            "project_id": created_projects[1].id,
            "content": "Hi Emma, I saw your application for our summer campaign. You look perfect for what we're looking for! Are you available for a test shoot next week?",
            "is_read": True,
            "created_at": datetime.utcnow() - timedelta(hours=7)
        },
        {
            "sender_id": emma.id,
            "recipient_id": beach_vibes.id,
            "project_id": created_projects[1].id,
            "content": "Hi Maria! I'm excited about this opportunity. Yes, I'm available for a test shoot next week. What should I prepare?",
            "is_read": False,
            "created_at": datetime.utcnow() - timedelta(hours=6)
        },
        
        # Conversation between Alex (creative) and Runway Productions (client) about Fashion Show DJ
        {
            "sender_id": runway_productions.id,
            "recipient_id": alex.id,
            "project_id": created_projects[2].id,
            "content": "Hey Alex, just wanted to confirm the details for our fashion show after-party. The event is on June 15th from 9 PM to 2 AM. Can you send me your setlist preferences?",
            "is_read": True,
            "created_at": datetime.utcnow() - timedelta(hours=23)
        },
        {
            "sender_id": alex.id,
            "recipient_id": runway_productions.id,
            "project_id": created_projects[2].id,
            "content": "Hi David, I'm looking forward to the event! I'll send you my setlist preferences by tomorrow. Do you have any specific requests for the music genre?",
            "is_read": True,
            "created_at": datetime.utcnow() - timedelta(hours=22)
        },
        
        # Conversation between Mike (creative) and Tech Startup (client) about Brand Identity
        {
            "sender_id": tech_startup.id,
            "recipient_id": mike.id,
            "project_id": created_projects[3].id,
            "content": "Hi Mike, we're excited to work with you on our brand identity project. Can we schedule a kickoff meeting for next Monday to discuss our requirements in detail?",
            "is_read": True,
            "created_at": datetime.utcnow() - timedelta(hours=5)
        },
        {
            "sender_id": mike.id,
            "recipient_id": tech_startup.id,
            "project_id": created_projects[3].id,
            "content": "Hi Jennifer, I'm looking forward to working with TechStartup Inc. Next Monday works great for me. What time would you prefer for the meeting?",
            "is_read": False,
            "created_at": datetime.utcnow() - timedelta(hours=4)
        },
        
        # Conversation between Lisa (creative) and Style Magazine (client) about Video Content
        {
            "sender_id": style_magazine.id,
            "recipient_id": lisa.id,
            "project_id": created_projects[4].id,
            "content": "Hi Lisa, I reviewed your application for our video content project. We'd like to move forward with you. Can you provide a timeline for the deliverables?",
            "is_read": True,
            "created_at": datetime.utcnow() - timedelta(hours=3)
        },
        {
            "sender_id": lisa.id,
            "recipient_id": style_magazine.id,
            "project_id": created_projects[4].id,
            "content": "Hi John, I'm excited to work with Style Magazine! I can deliver the first set of behind-the-scenes content within 2 weeks, and the promotional videos within 4 weeks. Does that work for you?",
            "is_read": False,
            "created_at": datetime.utcnow() - timedelta(hours=2)
        },
        
        # General messages not tied to specific projects
        {
            "sender_id": sarah.id,
            "recipient_id": mike.id,
            "content": "Hey Mike, are you available for a collaboration on a fashion project next month?",
            "is_read": True,
            "created_at": datetime.utcnow() - timedelta(days=1, hours=5)
        },
        {
            "sender_id": mike.id,
            "recipient_id": sarah.id,
            "content": "Hi Sarah! Yes, I'm interested. Let's discuss the details over a call.",
            "is_read": False,
            "created_at": datetime.utcnow() - timedelta(days=1, hours=4)
        }
    ]
    
    # Create messages
    for msg_data in messages_data:
        message = Message(**msg_data)
        db.add(message)
    
    db.commit()
    
    # Create mock payments
    payments_data = [
        # Payment for DJ services (accepted application)
        {
            "project_id": created_projects[2].id,
            "client_id": runway_productions.id,
            "creative_id": alex.id,
            "amount": 1000.0,
            "milestone_description": "Payment for DJ services at fashion show after-party",
            "stripe_payment_intent_id": "pi_dj_payment_001",
            "status": "released",
            "created_at": datetime.utcnow() - timedelta(days=2),
            "released_at": datetime.utcnow() - timedelta(days=1)
        },
        # Payment for brand identity project (pending)
        {
            "project_id": created_projects[3].id,
            "client_id": tech_startup.id,
            "creative_id": mike.id,
            "amount": 2800.0,
            "milestone_description": "50% deposit for brand identity design",
            "stripe_payment_intent_id": "pi_brand_payment_001",
            "status": "held_in_escrow",
            "created_at": datetime.utcnow() - timedelta(hours=5)
        },
        # Payment for video content (pending)
        {
            "project_id": created_projects[4].id,
            "client_id": style_magazine.id,
            "creative_id": lisa.id,
            "amount": 1000.0,
            "milestone_description": "Initial payment for video content creation",
            "stripe_payment_intent_id": "pi_video_payment_001",
            "status": "held_in_escrow",
            "created_at": datetime.utcnow() - timedelta(hours=3)
        }
    ]
    
    # Create payments
    for payment_data in payments_data:
        payment = Payment(**payment_data)
        db.add(payment)
    
    db.commit()
    
    # Create mock project files
    project_files_data = [
        # Files for Fashion Photographer project
        {
            "project_id": created_projects[0].id,
            "uploader_id": sarah.id,
            "filename": "fashion_portfolio_samples.zip",
            "file_url": "https://example.com/files/fashion_portfolio_samples.zip",
            "file_size": 15728640,  # 15MB
            "file_type": "application/zip",
            "created_at": datetime.utcnow() - timedelta(hours=9)
        },
        {
            "project_id": created_projects[0].id,
            "uploader_id": style_magazine.id,
            "filename": "brand_guidelines.pdf",
            "file_url": "https://example.com/files/brand_guidelines.pdf",
            "file_size": 2097152,  # 2MB
            "file_type": "application/pdf",
            "created_at": datetime.utcnow() - timedelta(hours=8)
        },
        
        # Files for Model for Summer Campaign project
        {
            "project_id": created_projects[1].id,
            "uploader_id": emma.id,
            "filename": "model_comp_card.pdf",
            "file_url": "https://example.com/files/model_comp_card.pdf",
            "file_size": 3145728,  # 3MB
            "file_type": "application/pdf",
            "created_at": datetime.utcnow() - timedelta(hours=6)
        },
        
        # Files for DJ for Fashion Show project
        {
            "project_id": created_projects[2].id,
            "uploader_id": alex.id,
            "filename": "dj_setlist.pdf",
            "file_url": "https://example.com/files/dj_setlist.pdf",
            "file_size": 1048576,  # 1MB
            "file_type": "application/pdf",
            "created_at": datetime.utcnow() - timedelta(hours=22)
        },
        {
            "project_id": created_projects[2].id,
            "uploader_id": runway_productions.id,
            "filename": "event_details.pdf",
            "file_url": "https://example.com/files/event_details.pdf",
            "file_size": 2097152,  # 2MB
            "file_type": "application/pdf",
            "created_at": datetime.utcnow() - timedelta(hours=21)
        },
        
        # Files for Brand Identity Designer project
        {
            "project_id": created_projects[3].id,
            "uploader_id": mike.id,
            "filename": "logo_concepts_v1.pdf",
            "file_url": "https://example.com/files/logo_concepts_v1.pdf",
            "file_size": 5242880,  # 5MB
            "file_type": "application/pdf",
            "created_at": datetime.utcnow() - timedelta(hours=4)
        },
        {
            "project_id": created_projects[3].id,
            "uploader_id": tech_startup.id,
            "filename": "company_brief.pdf",
            "file_url": "https://example.com/files/company_brief.pdf",
            "file_size": 1048576,  # 1MB
            "file_type": "application/pdf",
            "created_at": datetime.utcnow() - timedelta(hours=5)
        },
        
        # Files for Video Content Creator project
        {
            "project_id": created_projects[4].id,
            "uploader_id": lisa.id,
            "filename": "video_treatment.pdf",
            "file_url": "https://example.com/files/video_treatment.pdf",
            "file_size": 3145728,  # 3MB
            "file_type": "application/pdf",
            "created_at": datetime.utcnow() - timedelta(hours=2)
        }
    ]
    
    # Create project files
    for file_data in project_files_data:
        project_file = ProjectFile(**file_data)
        db.add(project_file)
    
    db.commit()
    
    print("Mock data seeded successfully!")
    print(f"Created {len(created_users)} users")
    print(f"Created {len(created_projects)} projects")
    print(f"Created {len(applications_data)} applications")
    print(f"Created {len(messages_data)} messages")
    print(f"Created {len(payments_data)} payments")
    print(f"Created {len(project_files_data)} project files")
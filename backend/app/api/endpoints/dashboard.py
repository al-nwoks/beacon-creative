import logging
from typing import Any, List
import time
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, and_

from app.db.database import get_db
from app.models.user import User
from app.models.gig import Gig
from app.models.application import Application
from app.models.message import Message
from app.models.payment import Payment
from app.auth.dependencies import get_current_active_user_dependency
from app.schemas.gig import Gig as GigSchema
from app.schemas.application import ApplicationWithCreative
from app.utils.performance import log_performance_metrics

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/client/stats")
def get_client_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = get_current_active_user_dependency
) -> Any:
    """
    Get dashboard statistics for client users.
    """
    start_time = time.time()
    logger.info(f"Fetching client dashboard stats for user {current_user.id}")
    
    try:
        # Get active gigs count
        active_gigs_count = db.query(Gig).filter(
            and_(
                Gig.client_id == current_user.id,
                Gig.status == "active"
            )
        ).count()
        
        # Get total spent (released payments)
        total_spent_result = db.query(func.sum(Payment.amount)).filter(
            and_(
                Payment.client_id == current_user.id,
                Payment.status == "released"
            )
        ).first()
        total_spent = float(total_spent_result[0]) if total_spent_result[0] else 0.0
        
        # Get applications count for client's gigs
        applications_count = db.query(Application).join(Gig).filter(
            Gig.client_id == current_user.id
        ).count()
        
        # Get active creatives (creatives with accepted applications)
        active_creatives_count = db.query(Application.creative_id).join(Gig).filter(
            and_(
                Gig.client_id == current_user.id,
                Application.status == "accepted"
            )
        ).distinct().count()
        
        stats = {
            "active_gigs": active_gigs_count,
            "total_spent": total_spent,
            "applications": applications_count,
            "active_creatives": active_creatives_count
        }
        
        end_time = time.time()
        log_performance_metrics("get_client_dashboard_stats", start_time, end_time)
        logger.info(f"Client dashboard stats retrieved for user {current_user.id}")
        return stats
    except Exception as e:
        logger.error(f"Error fetching client dashboard stats for user {current_user.id}: {str(e)}")
        raise

@router.get("/client/recent-gigs", response_model=List[GigSchema])
def get_client_recent_gigs(
    limit: int = 5,
    db: Session = Depends(get_db),
    current_user: User = get_current_active_user_dependency
) -> Any:
    """
    Get recent gigs for client users.
    """
    start_time = time.time()
    logger.info(f"Fetching recent gigs for client user {current_user.id}")
    
    try:
        gigs = db.query(Gig).filter(
            Gig.client_id == current_user.id
        ).order_by(Gig.created_at.desc()).limit(limit).all()
        
        end_time = time.time()
        log_performance_metrics("get_client_recent_gigs", start_time, end_time, {
            "gig_count": len(gigs)
        })
        logger.info(f"Found {len(gigs)} recent gigs for client user {current_user.id}")
        return gigs
    except Exception as e:
        logger.error(f"Error fetching recent gigs for client user {current_user.id}: {str(e)}")
        raise

@router.get("/client/recent-activity")
def get_client_recent_activity(
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = get_current_active_user_dependency
) -> Any:
    """
    Get recent activity for client users.
    """
    start_time = time.time()
    logger.info(f"Fetching recent activity for client user {current_user.id}")
    
    try:
        activity = []
        
        # Get recent application notifications
        recent_applications = db.query(Application, Gig).join(Gig).filter(
            and_(
                Gig.client_id == current_user.id,
                Application.created_at >= datetime.utcnow() - timedelta(days=30)
            )
        ).order_by(Application.created_at.desc()).limit(limit//3).all()
        
        for app, gig in recent_applications:
            activity.append({
                "type": "application",
                "action": "New application received",
                "gig": gig.title,
                "time": app.created_at.isoformat(),
                "timestamp": app.created_at.timestamp()
            })
        
        # Get recent payment notifications
        recent_payments = db.query(Payment, Gig).join(Gig).filter(
            and_(
                Payment.client_id == current_user.id,
                Payment.status == "released",
                Payment.released_at >= datetime.utcnow() - timedelta(days=30)
            )
        ).order_by(Payment.released_at.desc()).limit(limit//3).all()
        
        for payment, gig in recent_payments:
            activity.append({
                "type": "payment",
                "action": "Payment released",
                "gig": gig.title,
                "time": payment.released_at.isoformat(),
                "timestamp": payment.released_at.timestamp()
            })
        
        # Get completed gigs
        completed_gigs = db.query(Gig).filter(
            and_(
                Gig.client_id == current_user.id,
                Gig.status == "completed",
                Gig.updated_at >= datetime.utcnow() - timedelta(days=30)
            )
        ).order_by(Gig.updated_at.desc()).limit(limit//3).all()
        
        for gig in completed_gigs:
            activity.append({
                "type": "gig",
                "action": "Gig completed",
                "gig": gig.title,
                "time": gig.updated_at.isoformat(),
                "timestamp": gig.updated_at.timestamp()
            })
        
        # Sort by timestamp and limit
        activity.sort(key=lambda x: x["timestamp"], reverse=True)
        activity = activity[:limit]
        
        # Format time for display
        for item in activity:
            dt = datetime.fromisoformat(item["time"].replace("Z", "+00:00"))
            if datetime.utcnow() - dt < timedelta(hours=1):
                minutes_ago = int((datetime.utcnow() - dt).total_seconds() / 60)
                item["time_display"] = f"{minutes_ago} minutes ago"
            elif datetime.utcnow() - dt < timedelta(days=1):
                hours_ago = int((datetime.utcnow() - dt).total_seconds() / 3600)
                item["time_display"] = f"{hours_ago} hours ago"
            else:
                days_ago = int((datetime.utcnow() - dt).total_seconds() / 86400)
                item["time_display"] = f"{days_ago} days ago"
            del item["timestamp"]
        
        end_time = time.time()
        log_performance_metrics("get_client_recent_activity", start_time, end_time, {
            "activity_count": len(activity)
        })
        logger.info(f"Found {len(activity)} recent activities for client user {current_user.id}")
        return activity
    except Exception as e:
        logger.error(f"Error fetching recent activity for client user {current_user.id}: {str(e)}")
        raise

@router.get("/creative/stats")
def get_creative_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = get_current_active_user_dependency
) -> Any:
    """
    Get dashboard statistics for creative users.
    """
    start_time = time.time()
    logger.info(f"Fetching creative dashboard stats for user {current_user.id}")
    
    try:
        # Get active applications count
        active_applications_count = db.query(Application).filter(
            and_(
                Application.creative_id == current_user.id,
                Application.status == "pending"
            )
        ).count()
        
        # Get total earned (released payments)
        total_earned_result = db.query(func.sum(Payment.amount)).filter(
            and_(
                Payment.creative_id == current_user.id,
                Payment.status == "released"
            )
        ).first()
        total_earned = float(total_earned_result[0]) if total_earned_result[0] else 0.0
        
        # Get completed gigs count
        completed_gigs_count = db.query(Application).filter(
            and_(
                Application.creative_id == current_user.id,
                Application.status == "accepted"
            )
        ).count()
        
        # Calculate success rate (accepted applications / total applications)
        total_applications = db.query(Application).filter(
            Application.creative_id == current_user.id
        ).count()
        
        success_rate = 0
        if total_applications > 0:
            accepted_applications = db.query(Application).filter(
                and_(
                    Application.creative_id == current_user.id,
                    Application.status == "accepted"
                )
            ).count()
            success_rate = int((accepted_applications / total_applications) * 100)
        
        stats = {
            "active_applications": active_applications_count,
            "total_earned": total_earned,
            "completed_gigs": completed_gigs_count,
            "success_rate": success_rate
        }
        
        end_time = time.time()
        log_performance_metrics("get_creative_dashboard_stats", start_time, end_time)
        logger.info(f"Creative dashboard stats retrieved for user {current_user.id}")
        return stats
    except Exception as e:
        logger.error(f"Error fetching creative dashboard stats for user {current_user.id}: {str(e)}")
        raise

@router.get("/creative/recent-applications", response_model=List[ApplicationWithCreative])
def get_creative_recent_applications(
    limit: int = 5,
    db: Session = Depends(get_db),
    current_user: User = get_current_active_user_dependency
) -> Any:
    """
    Get recent applications for creative users.
    """
    start_time = time.time()
    logger.info(f"Fetching recent applications for creative user {current_user.id}")
    
    try:
        applications = db.query(Application).filter(
            Application.creative_id == current_user.id
        ).order_by(Application.created_at.desc()).limit(limit).all()
        
        end_time = time.time()
        log_performance_metrics("get_creative_recent_applications", start_time, end_time, {
            "application_count": len(applications)
        })
        logger.info(f"Found {len(applications)} recent applications for creative user {current_user.id}")
        return applications
    except Exception as e:
        logger.error(f"Error fetching recent applications for creative user {current_user.id}: {str(e)}")
        raise

@router.get("/creative/recent-activity")
def get_creative_recent_activity(
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = get_current_active_user_dependency
) -> Any:
    """
    Get recent activity for creative users.
    """
    start_time = time.time()
    logger.info(f"Fetching recent activity for creative user {current_user.id}")
    
    try:
        activity = []
        
        # Get recent application status updates
        recent_applications = db.query(Application, Gig).join(Gig).filter(
            and_(
                Application.creative_id == current_user.id,
                Application.updated_at >= datetime.utcnow() - timedelta(days=30)
            )
        ).order_by(Application.updated_at.desc()).limit(limit//3).all()
        
        for app, gig in recent_applications:
            if app.status in ["accepted", "rejected"]:
                activity.append({
                    "type": "application",
                    "action": f"Application {app.status}",
                    "gig": gig.title,
                    "time": app.updated_at.isoformat(),
                    "timestamp": app.updated_at.timestamp()
                })
        
        # Get recent message notifications
        recent_messages = db.query(Message, User).join(User, Message.sender_id == User.id).filter(
            and_(
                Message.recipient_id == current_user.id,
                Message.created_at >= datetime.utcnow() - timedelta(days=30)
            )
        ).order_by(Message.created_at.desc()).limit(limit//3).all()
        
        for message, sender in recent_messages:
            activity.append({
                "type": "message",
                "action": "New message received",
                "gig": sender.first_name + " " + sender.last_name,
                "time": message.created_at.isoformat(),
                "timestamp": message.created_at.timestamp()
            })
        
        # Get recent payment notifications
        recent_payments = db.query(Payment, Gig).join(Gig).filter(
            and_(
                Payment.creative_id == current_user.id,
                Payment.status == "released",
                Payment.released_at >= datetime.utcnow() - timedelta(days=30)
            )
        ).order_by(Payment.released_at.desc()).limit(limit//3).all()
        
        for payment, gig in recent_payments:
            activity.append({
                "type": "payment",
                "action": "Payment received",
                "gig": gig.title,
                "time": payment.released_at.isoformat(),
                "timestamp": payment.released_at.timestamp()
            })
        
        # Sort by timestamp and limit
        activity.sort(key=lambda x: x["timestamp"], reverse=True)
        activity = activity[:limit]
        
        # Format time for display
        for item in activity:
            dt = datetime.fromisoformat(item["time"].replace("Z", "+00:00"))
            if datetime.utcnow() - dt < timedelta(hours=1):
                minutes_ago = int((datetime.utcnow() - dt).total_seconds() / 60)
                item["time_display"] = f"{minutes_ago} minutes ago"
            elif datetime.utcnow() - dt < timedelta(days=1):
                hours_ago = int((datetime.utcnow() - dt).total_seconds() / 3600)
                item["time_display"] = f"{hours_ago} hours ago"
            else:
                days_ago = int((datetime.utcnow() - dt).total_seconds() / 86400)
                item["time_display"] = f"{days_ago} days ago"
            del item["timestamp"]
        
        end_time = time.time()
        log_performance_metrics("get_creative_recent_activity", start_time, end_time, {
            "activity_count": len(activity)
        })
        logger.info(f"Found {len(activity)} recent activities for creative user {current_user.id}")
        return activity
    except Exception as e:
        logger.error(f"Error fetching recent activity for creative user {current_user.id}: {str(e)}")
        raise

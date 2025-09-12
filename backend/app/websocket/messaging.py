from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
import json
import logging
import uuid
from typing import Dict, Any

from app.websocket.manager import manager
from app.db.database import get_db
from app.models.message import Message
from app.models.user import User
from app.models.notification import Notification
from app.models.gig import Gig
from app.models.application import Application
from app.schemas.message import MessageCreate
from app.auth.dependencies import get_current_user_from_websocket

logger = logging.getLogger(__name__)

router = APIRouter()

@router.websocket("/ws/messages")
async def websocket_endpoint(websocket: WebSocket, db: Session = Depends(get_db)):
    """WebSocket endpoint for real-time messaging"""
    try:
        # Authenticate user
        current_user = await get_current_user_from_websocket(websocket, db)
        if not current_user:
            await websocket.close(code=4000, reason="Authentication required")
            return
            
        # Connect user to WebSocket manager
        await manager.connect(websocket, current_user.id)
        
        try:
            while True:
                # Receive message from client
                data = await websocket.receive_text()
                message_data = json.loads(data)
                
                # Handle different message types
                message_type = message_data.get("type", "send_message")
                
                if message_type == "send_message":
                    await handle_send_message(websocket, current_user, message_data, db)
                elif message_type == "join_conversation":
                    await handle_join_conversation(websocket, current_user, message_data)
                elif message_type == "leave_conversation":
                    await handle_leave_conversation(websocket, current_user, message_data)
                elif message_type == "typing":
                    await handle_typing_indicator(websocket, current_user, message_data)
                elif message_type == "stop_typing":
                    await handle_stop_typing_indicator(websocket, current_user, message_data)
                else:
                    await websocket.send_text(json.dumps({
                        "type": "error",
                        "message": f"Unknown message type: {message_type}"
                    }))
                    
        except WebSocketDisconnect:
            logger.info(f"User {current_user.id} disconnected")
        except Exception as e:
            logger.error(f"Error handling WebSocket message for user {current_user.id}: {e}")
            await websocket.send_text(json.dumps({
                "type": "error",
                "message": "Internal server error"
            }))
        finally:
            # Clean up connection
            manager.disconnect(websocket, current_user.id)
            
    except Exception as e:
        logger.error(f"WebSocket connection error: {e}")
        await websocket.close(code=4001, reason="Connection error")

async def handle_send_message(websocket: WebSocket, current_user: User, message_data: Dict[str, Any], db: Session):
    """Handle sending a new message"""
    try:
        # Extract message content
        content = message_data.get("content", "")
        recipient_id = message_data.get("recipient_id")
        gig_id = message_data.get("gig_id")
        application_id = message_data.get("application_id")
        
        # Validate content
        if not content:
            await websocket.send_text(json.dumps({
                "type": "error",
                "message": "Message content is required"
            }))
            return
            
        # Validate recipient_id
        if not recipient_id:
            await websocket.send_text(json.dumps({
                "type": "error",
                "message": "Recipient ID is required"
            }))
            return
            
        try:
            recipient_id_int = int(recipient_id)
        except ValueError:
            await websocket.send_text(json.dumps({
                "type": "error",
                "message": "Invalid recipient ID format"
            }))
            return
        
        # Validate recipient
        recipient = db.query(User).filter(User.id == recipient_id_int).first()
        if not recipient:
            await websocket.send_text(json.dumps({
                "type": "error",
                "message": "Recipient not found"
            }))
            return
            
        # Check if recipient is not the sender
        if recipient_id_int == current_user.id:
            await websocket.send_text(json.dumps({
                "type": "error",
                "message": "Cannot send message to yourself"
            }))
            return
            
        # If gig_id is provided, validate it
        gig_id_uuid = None
        if gig_id:
            try:
                gig_id_uuid = uuid.UUID(gig_id)
                # Check if gig exists and user is involved
                gig = db.query(Gig).filter(Gig.id == gig_id_uuid).first()
                if not gig:
                    await websocket.send_text(json.dumps({
                        "type": "error",
                        "message": "Gig not found"
                    }))
                    return
                    
                # Check if both users are involved in the gig
                if (gig.client_id != current_user.id and gig.hired_creative_id != current_user.id) or \
                   (gig.client_id != recipient_id_int and gig.hired_creative_id != recipient_id_int):
                    await websocket.send_text(json.dumps({
                        "type": "error",
                        "message": "Both users must be involved in the gig"
                    }))
                    return
            except ValueError:
                await websocket.send_text(json.dumps({
                    "type": "error",
                    "message": "Invalid gig ID format"
                }))
                return
        
        # If application_id is provided, validate it
        application_id_uuid = None
        if application_id:
            try:
                application_id_uuid = uuid.UUID(application_id)
                # Check if application exists and user is involved
                application = db.query(Application).filter(Application.id == application_id_uuid).first()
                if not application:
                    await websocket.send_text(json.dumps({
                        "type": "error",
                        "message": "Application not found"
                    }))
                    return
                    
                # Get the gig
                gig = db.query(Gig).filter(Gig.id == application.gig_id).first()
                
                # Check if both users are involved in the application
                if (application.creative_id != current_user.id and gig.client_id != current_user.id) or \
                   (application.creative_id != recipient_id_int and gig.client_id != recipient_id_int):
                    await websocket.send_text(json.dumps({
                        "type": "error",
                        "message": "Both users must be involved in the application"
                    }))
                    return
            except ValueError:
                await websocket.send_text(json.dumps({
                    "type": "error",
                    "message": "Invalid application ID format"
                }))
                return
            
        # Create the message in database
        db_message = Message(
            sender_id=current_user.id,
            recipient_id=recipient_id_int,
            content=content,
            gig_id=gig_id_uuid,
            application_id=application_id_uuid,
        )
        
        db.add(db_message)
        db.commit()
        db.refresh(db_message)
        
        # Create notification for recipient
        notification = Notification(
            user_id=recipient_id_int,
            type="message",
            title="New Message",
            message=f"{current_user.first_name} {current_user.last_name} sent you a message",
            related_entity_type="message",
            related_entity_id=db_message.id,
        )
        db.add(notification)
        db.commit()
        
        # Prepare message response
        message_response = {
            "type": "new_message",
            "message": {
                "id": str(db_message.id),
                "sender_id": db_message.sender_id,
                "recipient_id": db_message.recipient_id,
                "content": db_message.content,
                "is_read": db_message.is_read,
                "created_at": db_message.created_at.isoformat() if db_message.created_at else None,
                "gig_id": str(db_message.gig_id) if db_message.gig_id else None,
                "application_id": str(db_message.application_id) if db_message.application_id else None
            }
        }
        
        # Send message to recipient
        conversation_id = f"{min(current_user.id, recipient_id_int)}_{max(current_user.id, recipient_id_int)}"
        await manager.send_message_to_conversation(
            json.dumps(message_response),
            conversation_id,
            exclude_user_id=current_user.id
        )
        
        # Send confirmation to sender
        await websocket.send_text(json.dumps({
            "type": "message_sent",
            "message_id": str(db_message.id)
        }))
        
        logger.info(f"Message sent from user {current_user.id} to {recipient_id_int}")
        
    except Exception as e:
        db.rollback()
        logger.error(f"Error sending message: {e}")
        await websocket.send_text(json.dumps({
            "type": "error",
            "message": "Failed to send message"
        }))

async def handle_join_conversation(websocket: WebSocket, current_user: User, message_data: Dict[str, Any]):
    """Handle joining a conversation"""
    try:
        conversation_id = message_data.get("conversation_id")
        if not conversation_id:
            await websocket.send_text(json.dumps({
                "type": "error",
                "message": "Conversation ID required"
            }))
            return
            
        await manager.join_conversation(current_user.id, conversation_id)
        
        await websocket.send_text(json.dumps({
            "type": "joined_conversation",
            "conversation_id": conversation_id
        }))
        
        logger.info(f"User {current_user.id} joined conversation {conversation_id}")
        
    except Exception as e:
        logger.error(f"Error joining conversation: {e}")
        await websocket.send_text(json.dumps({
            "type": "error",
            "message": "Failed to join conversation"
        }))

async def handle_leave_conversation(websocket: WebSocket, current_user: User, message_data: Dict[str, Any]):
    """Handle leaving a conversation"""
    try:
        conversation_id = message_data.get("conversation_id")
        if not conversation_id:
            await websocket.send_text(json.dumps({
                "type": "error",
                "message": "Conversation ID required"
            }))
            return
            
        await manager.leave_conversation(current_user.id, conversation_id)
        
        await websocket.send_text(json.dumps({
            "type": "left_conversation",
            "conversation_id": conversation_id
        }))
        
        logger.info(f"User {current_user.id} left conversation {conversation_id}")
        
    except Exception as e:
        logger.error(f"Error leaving conversation: {e}")
        await websocket.send_text(json.dumps({
            "type": "error",
            "message": "Failed to leave conversation"
        }))

async def handle_typing_indicator(websocket: WebSocket, current_user: User, message_data: Dict[str, Any]):
    """Handle typing indicator"""
    try:
        conversation_id = message_data.get("conversation_id")
        if not conversation_id:
            return
            
        # Broadcast typing indicator to conversation participants
        typing_message = {
            "type": "user_typing",
            "user_id": current_user.id,
            "conversation_id": conversation_id
        }
        
        await manager.send_message_to_conversation(
            json.dumps(typing_message), 
            conversation_id, 
            exclude_user_id=current_user.id
        )
        
    except Exception as e:
        logger.error(f"Error handling typing indicator: {e}")

async def handle_stop_typing_indicator(websocket: WebSocket, current_user: User, message_data: Dict[str, Any]):
    """Handle stop typing indicator"""
    try:
        conversation_id = message_data.get("conversation_id")
        if not conversation_id:
            return
            
        # Broadcast stop typing indicator to conversation participants
        stop_typing_message = {
            "type": "user_stopped_typing",
            "user_id": current_user.id,
            "conversation_id": conversation_id
        }
        
        await manager.send_message_to_conversation(
            json.dumps(stop_typing_message), 
            conversation_id, 
            exclude_user_id=current_user.id
        )
        
    except Exception as e:
        logger.error(f"Error handling stop typing indicator: {e}")
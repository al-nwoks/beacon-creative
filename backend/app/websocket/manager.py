from typing import Dict, Set, Optional
import json
from fastapi import WebSocket
from app.models.user import User
from app.models.message import Message
from app.schemas.message import MessageCreate
from app.db.database import get_db
import logging

logger = logging.getLogger(__name__)

class ConnectionManager:
    def __init__(self):
        # Store active connections: {user_id: set of websockets}
        self.active_connections: Dict[int, Set[WebSocket]] = {}
        # Store user conversations: {user_id: set of conversation_ids}
        self.user_conversations: Dict[int, Set[str]] = {}
        # Store conversation participants: {conversation_id: set of user_ids}
        self.conversation_participants: Dict[str, Set[int]] = {}

    async def connect(self, websocket: WebSocket, user_id: int):
        """Connect a websocket for a user"""
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = set()
        self.active_connections[user_id].add(websocket)
        logger.info(f"User {user_id} connected to WebSocket")

    def disconnect(self, websocket: WebSocket, user_id: int):
        """Disconnect a websocket for a user"""
        if user_id in self.active_connections:
            self.active_connections[user_id].discard(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
        logger.info(f"User {user_id} disconnected from WebSocket")

    async def join_conversation(self, user_id: int, conversation_id: str):
        """Join a conversation"""
        if user_id not in self.user_conversations:
            self.user_conversations[user_id] = set()
        self.user_conversations[user_id].add(conversation_id)
        
        if conversation_id not in self.conversation_participants:
            self.conversation_participants[conversation_id] = set()
        self.conversation_participants[conversation_id].add(user_id)
        logger.info(f"User {user_id} joined conversation {conversation_id}")

    async def leave_conversation(self, user_id: int, conversation_id: str):
        """Leave a conversation"""
        if user_id in self.user_conversations:
            self.user_conversations[user_id].discard(conversation_id)
            if not self.user_conversations[user_id]:
                del self.user_conversations[user_id]
        
        if conversation_id in self.conversation_participants:
            self.conversation_participants[conversation_id].discard(user_id)
            if not self.conversation_participants[conversation_id]:
                del self.conversation_participants[conversation_id]
        logger.info(f"User {user_id} left conversation {conversation_id}")

    async def send_personal_message(self, message: str, user_id: int):
        """Send a message to a specific user"""
        if user_id in self.active_connections:
            for websocket in self.active_connections[user_id].copy():
                try:
                    await websocket.send_text(message)
                except Exception as e:
                    logger.error(f"Error sending message to user {user_id}: {e}")
                    # Remove broken connections
                    self.active_connections[user_id].discard(websocket)

    async def send_message_to_conversation(self, message: str, conversation_id: str, exclude_user_id: Optional[int] = None):
        """Send a message to all users in a conversation"""
        if conversation_id in self.conversation_participants:
            for user_id in self.conversation_participants[conversation_id]:
                if user_id != exclude_user_id:
                    await self.send_personal_message(message, user_id)

    async def broadcast(self, message: str):
        """Broadcast a message to all connected users"""
        for user_id in list(self.active_connections.keys()):
            await self.send_personal_message(message, user_id)

    def get_user_conversations(self, user_id: int) -> Set[str]:
        """Get all conversations a user is part of"""
        return self.user_conversations.get(user_id, set())

    def get_conversation_participants(self, conversation_id: str) -> Set[int]:
        """Get all participants in a conversation"""
        return self.conversation_participants.get(conversation_id, set())

# Global connection manager instance
manager = ConnectionManager()
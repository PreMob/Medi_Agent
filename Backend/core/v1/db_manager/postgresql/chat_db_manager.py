from typing import Any, Dict, List, Optional, TypeVar, Union

from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from Backend.core.v1.common.logger import get_logger
from Backend.core.v1.db.session import get_db_session  # Assuming you have a session factory
from Backend.core.v1.models.chat import ChatSessionModel  # SQLAlchemy model for chat sessions
from Backend.core.v1.types.chat import ChatSession, ChatMessage

logger = get_logger(__name__)
T = TypeVar("T")

class ChatDBManager:
    """
    PostgreSQL-based Data Access Object for managing chat sessions and messages.
    """
    def __init__(self, db_session: Session = None):
        """Initialize the DAO with a database session."""
        self.db_session = db_session or get_db_session()
    
    def create(self, chat_session: ChatSession) -> ChatSession:
        """Create a new chat session."""
        try:
            db_session = ChatSessionModel(
                id=chat_session.id,
                user_id=chat_session.user_id,
                title=chat_session.title,
                messages=[msg.model_dump() for msg in chat_session.messages],
            )
            self.db_session.add(db_session)
            self.db_session.commit()
            return chat_session
        except SQLAlchemyError as e:
            self.db_session.rollback()
            logger.error(f"Failed to create chat session: {e}")
            raise
    
    def get_session(self, user_id: str, session_id: str) -> Optional[ChatSession]:
        """Retrieve a chat session by user_id and session_id."""
        try:
            session = self.db_session.query(ChatSessionModel).filter_by(id=session_id, user_id=user_id).first()
            if session:
                return ChatSession(
                    id=session.id,
                    user_id=session.user_id,
                    title=session.title,
                    messages=[ChatMessage(**msg) for msg in session.messages],
                )
            return None
        except SQLAlchemyError as e:
            logger.error(f"Failed to get chat session: {e}")
            return None
    
    def update_session_messages(self, chat_session: ChatSession) -> Optional[ChatSession]:
        """Update messages in an existing chat session."""
        try:
            session = self.db_session.query(ChatSessionModel).filter_by(id=chat_session.id).first()
            if session:
                session.messages = [msg.model_dump() for msg in chat_session.messages]
                self.db_session.commit()
                return chat_session
            return None
        except SQLAlchemyError as e:
            self.db_session.rollback()
            logger.error(f"Failed to update chat session messages: {e}")
            return None
    
    def delete(self, session_id: str) -> bool:
        """Delete a chat session by its ID."""
        try:
            session = self.db_session.query(ChatSessionModel).filter_by(id=session_id).first()
            if session:
                self.db_session.delete(session)
                self.db_session.commit()
                return True
            return False
        except SQLAlchemyError as e:
            self.db_session.rollback()
            logger.error(f"Failed to delete chat session: {e}")
            return False

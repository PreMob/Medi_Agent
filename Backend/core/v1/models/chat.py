from datetime import datetime
from typing import List
from sqlalchemy import Column, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from Backend.core.v1.db.base import Base  # Assuming your Base model is here
from Backend.core.v1.types.utils import generate_uuid, get_utc_now

class ChatSessionModel(Base):
    """
    SQLAlchemy model for storing chat sessions in the database.
    """
    __tablename__ = "chat_sessions"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, nullable=False, index=True)
    title = Column(String, nullable=False)
    created_at = Column(DateTime, default=get_utc_now, nullable=False)
    updated_at = Column(DateTime, default=get_utc_now, nullable=False, onupdate=get_utc_now)
    messages = Column(JSON, default=list)  # Storing messages as a JSON array

    def __repr__(self):
        return f"<ChatSessionModel(id={self.id}, user_id={self.user_id}, title={self.title})>"

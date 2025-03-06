from datetime import datetime
from typing import List, Literal, Optional

from pydantic import BaseModel, Field, field_serializer

from Backend.core.v1.types.utils import get_utc_now, generate_uuid



class ChatMessage(BaseModel):
    """Model representing a single chat message."""

    role: Literal["user", "assistant"] = Field(
        ..., description="Role of the message sender (user/assistant)"
    )

    content: Optional[str] = Field(default=None, description="Content of the message")

    timestamp: datetime = Field(default_factory=get_utc_now)

    @field_serializer("timestamp")
    def serialize_datetime(self, dt: datetime) -> str:
        return dt.isoformat()


class ChatSession(BaseModel):
    """Model representing a chat session with its messages and metadata."""

    id: str = Field(
        default_factory=generate_uuid,
        description="Unique identifier for the chat session",
    )
    user_id: str = Field(..., description="ID of the user who owns this chat session")
    created_at: datetime = Field(default_factory=get_utc_now)
    updated_at: datetime = Field(default_factory=get_utc_now)
    title: str
    messages: List[ChatMessage] = Field(default_factory=list)

    def add_message(self, message: ChatMessage) -> None:
        """Add a new message to the chat session and update the timestamp."""
        self.messages.append(message)
        self.updated_at = get_utc_now()

    @field_serializer("created_at", "updated_at")
    def serialize_datetime(self, dt: datetime) -> str:
        return dt.isoformat()
from typing import List, Optional

from pydantic import BaseModel, Field

from Backend.core.v1.types.chat import ChatMessage, ChatSession


class ChatResponse(BaseModel):
    response: ChatMessage 
    session_id: str = Field(..., description="ID of the chat session")
    session_title: Optional[str] = Field(None, description="Title of the chat session")


class ChatSessionList(BaseModel):
    sessions: List[ChatSession] = Field(
        default_factory=list, description="List of chat sessions"
    )

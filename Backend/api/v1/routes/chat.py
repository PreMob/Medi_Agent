# This file contains the routes for the chat API
from fastapi import APIRouter, Depends, HTTPException

from Backend.api.v1.dependencies.auth import UserInfo, verify_api_key
from Backend.core.v1.common.exceptions import NotFoundOrAccessException
from Backend.services.v1.chat.service import ChatService

from Backend.api.v1.schema.chat.request import ChatRequest
from ..schema.chat.response import (
    ChatMessage,
    ChatResponse,
    ChatSession,
    ChatSessionList,
)

router = APIRouter()


@router.post("/new", response_model=ChatResponse)
async def create_new_chat(
    request: ChatRequest, user_info: UserInfo = Depends(verify_api_key)
):
    """Create a new chat session and send the first message"""
    chat_service = ChatService()
    return await chat_service.handle_new_chat_message(
        user_info.user_id, request.message
    )


@router.post("/{session_id}", response_model=ChatResponse)
async def send_message(
    session_id: str, request: ChatRequest, user_info: UserInfo = Depends(verify_api_key)
):
    """Send a message to an existing chat session"""
    chat_service = ChatService()

    try:
        return await chat_service.handle_message(
            user_info.user_id, session_id, request.message, request.sources
        )
    except NotFoundOrAccessException as e:
        raise HTTPException(status_code=403, detail=str(e))


@router.get("/{session_id}", response_model=ChatSession)
async def get_chat_history(
    session_id: str, user_info: UserInfo = Depends(verify_api_key)
):
    """Get the full history of a chat session"""
    chat_service = ChatService()
    try:
        return chat_service.get_chat_history(user_info.user_id, session_id)
    except NotFoundOrAccessException as e:
        raise HTTPException(status_code=403, detail=str(e))


@router.delete("/{session_id}")
async def delete_chat(session_id: str, user_info: UserInfo = Depends(verify_api_key)):
    """Delete a chat session"""
    chat_service = ChatService()
    try:
        delete_status = chat_service.delete_session(user_info.user_id, session_id)
        if delete_status:
            return {
                "status": "success",
                "message": f"Chat {session_id} deleted",
            }
        else:
            raise HTTPException(status_code=501, detail="Failed to delete session")
    except NotFoundOrAccessException as e:
        raise HTTPException(
            status_code=403, detail=str(e)
        )


@router.get("/", response_model=ChatSessionList)
async def get_all_chats(user_info: UserInfo = Depends(verify_api_key)):
    """Get metadata for all chat sessions"""
    chat_service = ChatService()
    return ChatSessionList(
        sessions=chat_service.get_chat_history_by_user_id(user_info.user_id)
    )

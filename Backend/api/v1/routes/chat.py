# This file contains the routes for the chat API
import os

from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from fastapi.responses import JSONResponse

from Backend.api.v1.dependencies.auth import UserInfo, verify_api_key
from Backend.core.v1.common.exceptions import NotFoundOrAccessException
from Backend.services.v1.chat.service import ChatService
from Backend.api.v1.schema.chat.request import ChatRequest
from Backend.api.v1.schema.chat.response import ChatResponse, ChatSession, ChatSessionList
from Backend.core.v1.agents.ocr_agent import process_document

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

@router.post("/upload", response_model=JSONResponse)
async def upload_file(
    file: UploadFile = File(...), user_info: UserInfo = Depends(verify_api_key)
):
    """Upload a PDF or image file"""
    if file.content_type not in ["application/pdf", "image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    return JSONResponse(content={"filename": file.filename, "status": "file received"})

@router.post("/process-file", response_model=JSONResponse)
async def process_file(file: UploadFile = File(...), user_info: UserInfo = Depends(verify_api_key)):
    """Upload and process a PDF or image file"""
    if file.content_type not in ["application/pdf", "image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    file_location = f"/tmp/{file.filename}"
    with open(file_location, "wb") as f:
        f.write(file.file.read())
    
    result = process_document(file_location)
    
    os.remove(file_location)
    
    return JSONResponse(content={"filename": file.filename, "result": result})

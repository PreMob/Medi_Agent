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
from Backend.core.v1.utils.env_config import load_environment, configure_google_api

# Load environment variables and configure Google API on startup
load_environment()
configure_google_api()

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
        # Remove the request.sources parameter which doesn't exist in the method signature
        return await chat_service.handle_message(
            user_info.user_id, session_id, request.message
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

# @router.post("/upload", response_model=JSONResponse)
# async def upload_file(
#     file: UploadFile = File(...), user_info: UserInfo = Depends(verify_api_key)
# ):
#     """Upload a PDF or image file"""
#     if file.content_type not in ["application/pdf", "image/jpeg", "image/png"]:
#         raise HTTPException(status_code=400, detail="Invalid file type")
    
#     return JSONResponse(content={"filename": file.filename, "status": "file received"})

# @router.post("/process-file", response_model=JSONResponse)
# async def process_file(file: UploadFile = File(...), user_info: UserInfo = Depends(verify_api_key)):
#     """Upload and process a PDF or image file"""
#     if file.content_type not in ["application/pdf", "image/jpeg", "image/png"]:
#         raise HTTPException(status_code=400, detail="Invalid file type")
    
#     file_location = f"/tmp/{file.filename}"
#     with open(file_location, "wb") as f:
#         f.write(file.file.read())
    
#     result = process_document(file_location)
    
#     os.remove(file_location)
    
#     return JSONResponse(content={"filename": file.filename, "result": result})

@router.post("/process-file/{session_id}", response_model=dict)
async def process_file(
    session_id: str,
    file: UploadFile = File(...),
    user_info: UserInfo = Depends(verify_api_key)
):
    import tempfile
    import shutil
    
    # Validate file type
    allowed_types = ["application/pdf", "image/jpeg", "image/png", "image/jpg"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid file type. Supported types: {', '.join(allowed_types)}"
        )
    
    # Create temporary file with proper extension
    file_extension = ""
    if file.content_type == "application/pdf":
        file_extension = ".pdf"
    elif file.content_type in ["image/jpeg", "image/jpg"]:
        file_extension = ".jpg"
    elif file.content_type == "image/png":
        file_extension = ".png"
    
    try:
        # Use tempfile for cross-platform compatibility
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as tmp_file:
            # Read file content
            content = await file.read()
            tmp_file.write(content)
            file_location = tmp_file.name
        
        # Extract text and generate summary
        result = process_document(file_location)
        
        # Clean up temporary file
        os.remove(file_location)
          # Check if processing was successful
        if result.startswith("Error") or result.startswith("File not found") or result.startswith("No text"):
            return JSONResponse(
                status_code=400,
                content={
                    "status": "error",
                    "message": result,
                    "filename": file.filename
                }
            )
        
        # Return processed data without injecting into chat session
        # The frontend will handle adding this to the conversation
        return JSONResponse(content={
            "status": "success",
            "message": "Document processed successfully",
            "filename": file.filename,
            "extracted_data": result
        })
            
    except Exception as e:
        # Clean up temporary file if it exists
        if 'file_location' in locals() and os.path.exists(file_location):
            os.remove(file_location)
        raise HTTPException(
            status_code=500, 
            detail=f"Error processing file: {str(e)}"
        )
import os
from pathlib import Path
from dotenv import load_dotenv
from Backend.core.v1.utils.env_config import load_environment

# Load Environment Variables from backend root
load_environment()

# FastAPI App 
from fastapi import FastAPI 
from fastapi.middleware.cors import CORSMiddleware
from Backend.api.v1.routes.chat import router as chat_router

app = FastAPI()

# Add Middlewares 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add Routes 
app.include_router(chat_router, prefix="/api/v1/chat", tags=["chat"])

# Root Route 
@app.get("/")
def read_root():
    return {"status": "OK"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("Backend.main:app", host="0.0.0.0", port=8000)

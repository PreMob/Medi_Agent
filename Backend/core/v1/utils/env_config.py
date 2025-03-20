import os
import logging
from dotenv import load_dotenv
import google.generativeai as genai
from pathlib import Path

logger = logging.getLogger(__name__)

def load_environment():
    """Load environment variables from .env file in the backend root directory."""
    # Get the backend root directory path
    backend_root = Path(__file__).parent.parent.parent.parent
    env_path = backend_root / ".env"
    
    if not env_path.exists():
        logger.warning(f".env file not found at {env_path}")
    else:
        load_dotenv(dotenv_path=env_path)
        logger.info(f"Environment variables loaded from {env_path}")

def configure_google_api():
    """Configure Google Generative AI with the appropriate API key."""
    # Try to get API key from environment variables
    api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    
    if not api_key:
        logger.error("No Google API key found in environment variables")
        raise ValueError("Missing Google API key. Please set GEMINI_API_KEY or GOOGLE_API_KEY in .env file")
    
    # Configure the Google Generative AI client
    genai.configure(api_key=api_key)
    logger.info("Google API configured successfully")
    
    return api_key

from sqlalchemy import inspect

from Backend.core.v1.db.base import Base
from Backend.core.v1.db.session import engine
from Backend.core.v1.common.logger import get_logger

# Import all models to ensure they're registered with the Base metadata
# This ensures create_all() includes all your model tables
from Backend.core.v1.models.chat import ChatSessionModel

logger = get_logger(__name__)

def create_tables():
    """Create all tables defined in the models."""
    inspector = inspect(engine)
    if not inspector.has_table("chat_sessions"):
        logger.info("Creating database tables...")
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
    else:
        logger.info("Database tables already exist")

def initialize_db():
    """Initialize the database."""
    create_tables()

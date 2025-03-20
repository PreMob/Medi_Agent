from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
import os

# Load database URL from environment variable with no default value containing credentials
DATABASE_URL = os.getenv("DATABASE_URL", "")

# Ensure DATABASE_URL is provided
if not DATABASE_URL:
    raise ValueError("Database connection information missing. Please set the DATABASE_URL environment variable.")

# Create the database engine
engine = create_engine(DATABASE_URL, pool_pre_ping=True)

# Create a session factory
SessionFactory = sessionmaker(bind=engine, autoflush=False, autocommit=False)

# Scoped session to ensure thread safety
SessionLocal = scoped_session(SessionFactory)


def get_db_session():
    """Dependency function to provide a database session."""
    # Import here to avoid circular imports
    from Backend.core.v1.db.init_db import initialize_db
    
    # Ensure tables exist before creating a session
    initialize_db()
    
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

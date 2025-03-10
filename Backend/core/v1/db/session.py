from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
import os

# Load database URL from environment variables or default configuration
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/mydatabase")

# Create the database engine
engine = create_engine(DATABASE_URL, pool_pre_ping=True)

# Create a session factory
SessionFactory = sessionmaker(bind=engine, autoflush=False, autocommit=False)

# Scoped session to ensure thread safety
SessionLocal = scoped_session(SessionFactory)


def get_db_session():
    """Dependency function to provide a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

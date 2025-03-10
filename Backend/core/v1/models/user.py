from sqlalchemy import Column, String
from Backend.core.v1.db.base import Base
from Backend.core.v1.types.utils import generate_uuid

class UserModel(Base):
    """
    SQLAlchemy model for storing user details in the database.
    """
    __tablename__ = "user_table"

    user_id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)

    def __repr__(self):
        return f"<UserModel(user_id={self.user_id}, name={self.name})>"

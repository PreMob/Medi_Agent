from typing import Optional

from fastapi import Header, HTTPException
from pydantic import BaseModel


class UserInfo(BaseModel):
    user_id: str
    role: str
    organization: str
    name: str


def mock_decode_api_key(api_key: str) -> UserInfo:
    """Mock function to decode API key. In production, this would validate and decode the key properly."""
    # This is just a mock implementation for development
    if api_key == "test-admin-key":
        return UserInfo(
            user_id="admin123",
            role="admin",
            name="Admin User",
            organization="medi-agent"
        )
    elif api_key == "test-user-key":
        return UserInfo(
            user_id="user123",
            role="user",
            name="Regular User",
            organization="medi-agent"
        )
    else:
        # TODO: Implement actual API key validation
        return UserInfo(
            user_id=api_key,
            role="user",
            name="Regular User",
            organization="medi-agent"
        )
    # raise HTTPException(status_code=401, detail="Invalid API key")


async def verify_api_key(x_api_key: str = Header(..., alias="X-API-Key")) -> UserInfo:
    """Verify the API key and return user information."""
    if not x_api_key:
        raise HTTPException(status_code=401, detail="X-API-Key header is required")

    try:
        user_info = mock_decode_api_key(x_api_key)
        return user_info
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid API key: {str(e)}")


async def require_admin(x_api_key: str = Header(..., alias="X-API-Key")) -> UserInfo:
    """Verify that the user has admin role."""
    user_info = await verify_api_key(x_api_key)
    if user_info.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user_info

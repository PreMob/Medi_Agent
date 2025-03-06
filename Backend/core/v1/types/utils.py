from datetime import datetime, timezone
from typing import Optional
from uuid import uuid4


def get_utc_now() -> datetime:
    return datetime.now(timezone.utc)


def generate_uuid(prefix: Optional[str] = "") -> str:
    if prefix:
        return f"{prefix}_{str(uuid4())}"
    return str(uuid4())
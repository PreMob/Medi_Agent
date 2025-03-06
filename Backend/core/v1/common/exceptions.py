from typing import Optional

NOT_FOUND_MESSAGE = "{} not found or user does not have access"


class NotFoundOrAccessException(Exception):
    """Exception raised for any <object> not found or user does not have access"""

    def __init__(self, object_type: Optional[str] = None, message=NOT_FOUND_MESSAGE):
        if object_type:
            self.message = message.format(object_type)
        else:
            self.message = message
        super().__init__(self.message)
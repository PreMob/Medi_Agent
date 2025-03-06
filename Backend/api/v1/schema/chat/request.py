from pydantic import BaseModel, ConfigDict, Field


class ChatRequest(BaseModel):
    message: str = Field(..., description="Message to send to the chat session")

    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "message": "I have headache, running nose and fever",
                },
                {
                    "message": "My stomach hurts and I have a fever",
                },
            ]
        }
    )

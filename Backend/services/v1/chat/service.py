
from Backend.api.v1.schema.chat.response import ChatResponse
from Backend.config.v1.constants import CHAT_DEFAULT_TITLE
from Backend.core.v1.agents.chat_bot_agent import HealthcareChatAgent  # Updated to use HealthcareChatAgent
from Backend.core.v1.common.exceptions import NotFoundOrAccessException
from Backend.core.v1.common.logger import get_logger
from Backend.core.v1.db_manager.postgresql.chat_db_manager import ChatDBManager
from Backend.core.v1.types.chat import ChatMessage, ChatSession

logger = get_logger(__name__)


class ChatService:
    """Service for handling chat interactions and managing chat sessions using PostgreSQL."""

    def __init__(self, chat_db_manager: ChatDBManager = ChatDBManager()):
        """Initialize the ChatService.

        Args:
            chat_dao: Data access object for chat persistence.
        """
        self.chat_db_manager = chat_db_manager
        self.agent = HealthcareChatAgent()  # Directly instantiate HealthcareChatAgent

    async def handle_new_chat_message(self, user_id: str, message: str) -> ChatResponse:
        """Create a new chat session and handle the first message.

        Args:
            user_id: ID of the user creating the chat.
            message: Initial message content.

        Returns:
            ChatResponse containing the assistant's response and session info.
        """
        session = self._create_new_session(user_id)
        return await self.handle_message(user_id, session.id, message)

    async def handle_message(self, user_id: str, session_id: str, user_message: str) -> ChatResponse:
        """Handle a message in an existing chat session.

        Args:
            user_id: ID of the user.
            session_id: ID of the chat session.
            user_message: Content of the user's message.

        Returns:
            ChatResponse containing the assistant's response and session info.

        Raises:
            ValueError: If session is not found.
        """
        session = self.chat_db_manager.get_session(user_id, session_id)
        if not session:
            raise ValueError("Session not found")

        response_text = self.agent.process_message(user_message)  # Use HealthcareChatAgent's process_message method

        user_message_obj = ChatMessage(role="user", content=user_message)
        assistant_message_obj = ChatMessage(role="assistant", content=response_text)
        
        session.messages.append(user_message_obj)
        session.messages.append(assistant_message_obj)
        
        updated_session = self.chat_db_manager.update_session_messages(session)
        if not updated_session:
            raise Exception("Failed to update session messages")

        return ChatResponse(
            response=assistant_message_obj,
            session_id=session_id,
            session_title=updated_session.title,
        )

    def _create_new_session(self, user_id: str) -> ChatSession:
        """Create a new chat session for a user.

        Args:
            user_id: ID of the user creating the session.

        Returns:
            Newly created ChatSession object.
        """
        return self.chat_db_manager.create(ChatSession(user_id=user_id, title=CHAT_DEFAULT_TITLE, messages=[]))

    def get_chat_history(self, user_id: str, session_id: str) -> ChatSession:
        """Get a chat session by its ID.

        Args:
            user_id: ID of the user.
            session_id: ID of the chat session to retrieve.

        Returns:
            ChatSession object if found.
        """
        return self.chat_db_manager.get_session(user_id, session_id)

    def delete_session(self, user_id: str, session_id: str) -> bool:
        """Delete a chat session.

        Args:
            user_id: ID of the user.
            session_id: ID of the chat session to delete.

        Returns:
            True if the session was deleted successfully, False otherwise.
        """
        if not self.chat_db_manager.get_session(user_id, session_id):
            raise NotFoundOrAccessException("Session not found")
        return self.chat_db_manager.delete(session_id)

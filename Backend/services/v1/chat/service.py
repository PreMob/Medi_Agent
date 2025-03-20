# this file contains the ChatService class which is responsible for handling chat interactions and managing chat sessions using PostgreSQL.
from Backend.api.v1.schema.chat.response import ChatResponse
from Backend.config.v1.constants import CHAT_DEFAULT_TITLE
from Backend.core.v1.agents.chat_bot_agent import HealthcareChatAgent
from Backend.core.v1.common.exceptions import NotFoundOrAccessException, AgentProcessingException
from Backend.core.v1.common.logger import get_logger
from Backend.core.v1.db_manager.postgresql.chat_db_manager import ChatDBManager
from Backend.core.v1.types.chat import ChatMessage, ChatSession
from Backend.core.v1.db.init_db import initialize_db

logger = get_logger(__name__)


class ChatService:
    """Service for handling chat interactions and managing chat sessions using PostgreSQL."""

    def __init__(self, chat_db_manager: ChatDBManager = None):
        """Initialize the ChatService.

        Args:
            chat_dao: Data access object for chat persistence.
        """
        # Initialize database tables before creating the chat manager
        initialize_db()
        
        self.chat_db_manager = chat_db_manager or ChatDBManager()
        self.agent = HealthcareChatAgent()
        logger.info("ChatService initialized with database manager and agent")

    async def handle_new_chat_message(self, user_id: str, message: str) -> ChatResponse:
        """Create a new chat session and handle the first message.

        Args:
            user_id: ID of the user creating the chat.
            message: Initial message content.

        Returns:
            ChatResponse containing the assistant's response and session info.
        """
        try:
            logger.info(f"Creating new chat session for user {user_id}")
            session = self._create_new_session(user_id)
            return await self.handle_message(user_id, session.id, message)
        except Exception as e:
            logger.error(f"Failed to create new chat session: {str(e)}")
            raise

    async def handle_message(self, user_id: str, session_id: str, user_message: str) -> ChatResponse:
        """Handle a message in an existing chat session.

        Args:
            user_id: ID of the user.
            session_id: ID of the chat session.
            user_message: Content of the user's message.

        Returns:
            ChatResponse containing the assistant's response and session info.

        Raises:
            NotFoundOrAccessException: If session is not found or user doesn't have access.
            AgentProcessingException: If there's an error with the agent processing.
        """
        logger.debug(f"Handling message for session {session_id} from user {user_id}")
        
        try:
            session = self.chat_db_manager.get_session(user_id, session_id)
            if not session:
                logger.warning(f"Session {session_id} not found for user {user_id}")
                raise NotFoundOrAccessException("Session")
            
            try:
                response_text = self.agent.process_message(user_message)
            except Exception as e:
                logger.error(f"Agent failed to process message: {str(e)}")
                raise AgentProcessingException(f"Failed to process message: {str(e)}")
                
            user_message_obj = ChatMessage(role="user", content=user_message)
            assistant_message_obj = ChatMessage(role="assistant", content=response_text)
            
            session.messages.append(user_message_obj)
            session.messages.append(assistant_message_obj)
            
            try:
                updated_session = self.chat_db_manager.update_session_messages(session)
                if not updated_session:
                    logger.error(f"Failed to update messages for session {session_id}")
                    raise Exception("Failed to update session messages")
                
                logger.info(f"Successfully processed message for session {session_id}")
                return ChatResponse(
                    response=assistant_message_obj,
                    session_id=session_id,
                    session_title=updated_session.title,
                )
            except Exception as e:
                logger.error(f"Database error while updating session messages: {str(e)}")
                raise
                
        except NotFoundOrAccessException:
            # Re-raise the exception since we've already logged it
            raise
        except Exception as e:
            logger.error(f"Unexpected error in handle_message: {str(e)}")
            raise

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

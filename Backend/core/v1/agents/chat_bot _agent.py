import google.generativeai as genai
import os
from dotenv import load_dotenv
from typing import Dict, List

load_dotenv()

class HealthcareChatAgent:
    def __init__(self):
        # Define system_instruction first
        self.system_instruction = """
        You are a medical AI assistant designed to provide users with basic medical insights based on symptoms, prescriptions, and reports. Your responses should be informative, empathetic, and easy to understand. Follow these rules:
        Conversation Flow
        Redirect non-health questions: "I’m here to help with health queries! What brings you here?"

        Information Gathering
        Ask targeted questions: "Are you experiencing other symptoms, like [examples]?"

        Medical Insights
        For symptoms: "Possible causes include [general info]. Always consult a doctor for diagnosis."
        For prescriptions/reports: "This medication treats [condition]. Follow your doctor’s instructions. Need clarifications?"

        Critical Safety Rules
        Emergencies: "This sounds serious. Seek emergency care immediately."
        Uncertainty/Privacy: "I recommend consulting a healthcare provider." Never store/user data.
        """
        
        # Then get API key and configure model
        self.api_key = os.getenv("GEMINI_API_KEY")
        self._configure_model()
        self.conversation_history: List[Dict[str, str]] = []

    def _configure_model(self):
        genai.configure(api_key=self.api_key)
        
        self.safety_settings = [
            {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_ONLY_HIGH"},
            {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
            {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
            {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"}
        ]
        
        self.generation_config = {
            "temperature": 0.3,
            "max_output_tokens": 500
        }

        self.model = genai.GenerativeModel(
            model_name='gemini-2.0-flash',
            generation_config=self.generation_config,
            system_instruction=self.system_instruction,
            safety_settings=self.safety_settings
        )

    def _format_history(self):
        return [
            {
                "role": "user" if msg["role"] == "user" else "model",
                "parts": [msg["text"]]
            }
            for msg in self.conversation_history
        ]

    def process_message(self, user_input: str) -> str:
        try:
            # First append user message to history
            self.conversation_history.append({"role": "user", "text": user_input})
            
            # Create new chat session with updated history
            chat = self.model.start_chat(history=self._format_history())
            
            try:
                # Send message and get response
                response = chat.send_message(user_input)
                
                if response and response.text:
                    # Only append assistant response if valid
                    self.conversation_history.append({
                        "role": "assistant", 
                        "text": response.text
                    })
                    return response.text
                
                return "I apologize, but I wasn't able to generate a response. Please try rephrasing your question."
                
            except Exception as chat_error:
                # Remove the user message if response failed
                self.conversation_history.pop()
                return f"Chat Error: {str(chat_error)}. Please try again."
            
        except Exception as e:
            return f"System Error: {str(e)}. Please try again later."

    def reset_conversation(self):
        self.conversation_history = []

if __name__ == "__main__":
    bot = HealthcareChatAgent()
    print("Healthcare Assistant: Hello! How can I assist you today? (Type 'exit' to quit)")
    
    while True:
        user_input = input("You: ")
        if user_input.lower() in ['exit', 'quit']:
            print("Assistant: Stay healthy!")
            break
            
        response = bot.process_message(user_input)
        print(f"\nAssistant: {response}\n")
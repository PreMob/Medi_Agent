import google.generativeai as genai
import os
import re
from symptom_agent import SymptomAnalyzerAgent as agent2
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
        self.last_symptoms = ""

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
    def _extract_symptoms_from_history(self):
        """Scan conversation history for symptom descriptions"""
        symptom_keywords = [
        # General Symptoms
        "pain", "discomfort", "weakness", "fatigue", "dizziness", "nausea", "vomiting", 
        "fever", "chills", "sweating",

        # Respiratory Symptoms
        "cough", "shortness of breath", "wheezing", "chest pain", "congestion", "runny nose", 
        "sneezing", "sore throat", "hoarseness", "difficulty breathing",

        # Gastrointestinal Symptoms
        "stomach pain", "bloating", "gas", "diarrhea", "constipation", "acid reflux", 
        "heartburn", "loss of appetite", "nausea after eating", "vomiting blood",

        # Head & Neurological Symptoms
        "headache", "migraine", "dizziness", "lightheadedness", "confusion", "memory loss", 
        "fainting", "numbness", "tingling sensation", "seizures",

        # Muscle & Joint Symptoms
        "muscle pain", "stiffness", "cramps", "joint pain", "swelling", "limited movement", 
        "back pain", "neck pain", "weak grip", "muscle spasms",

        # Skin & Allergy Symptoms
        "rash", "itching", "redness", "swelling", "dry skin", "hives", "bruising", 
        "peeling skin", "sensitivity to touch", "skin discoloration",

        # Mental Health Symptoms
        "anxiety", "depression", "mood swings", "brain fog", "irritability", "hallucinations", 
        "insomnia", "feeling overwhelmed", "panic attacks", "hopelessness",

        # Eye & Vision Symptoms
        "blurry vision", "eye pain", "red eyes", "watery eyes", "sensitivity to light", 
        "dry eyes", "double vision", "floaters", "blind spots", "swollen eyelids",

        # Urinary & Reproductive Symptoms
        "frequent urination", "burning sensation when urinating", "blood in urine", "pelvic pain", 
        "irregular periods", "heavy bleeding", "erectile dysfunction", "low libido", 
        "painful intercourse", "vaginal discharge",

        # Other Symptoms
        "swollen lymph nodes", "choking sensation", "difficulty swallowing", "unexplained weight loss", 
        "unexplained weight gain", "hair loss", "chronic fatigue", "night sweats", 
        "cold hands and feet", "clammy skin"
        ]
        
        # Find all potential symptom messages (last 5 messages)
        symptom_messages = []
        for msg in reversed(self.conversation_history[-5:]):
            if msg["role"] == "user":
                text = msg["text"].lower()
                if any(kw in text for kw in symptom_keywords):
                    symptom_messages.append(msg["text"])
        
        return symptom_messages[0] if symptom_messages else None

    def _clean_symptoms_input(self, symptoms: str) -> str:
        """Extract key symptom phrases from conversation text"""
        try:
            response = self.model.generate_content(
                f"Extract ONLY medical symptoms from this text as comma-separated values: {symptoms}\n"
                "Focus on anatomical terms and clinical descriptions. Exclude non-symptom phrases.\n"
                "Example input: 'pain in my ass when pooping'\n"
                "Example output: anal pain during defecation, rectal bleeding, hematochezia\n"
                "Format: Strictly use commas to separate symptoms, no numbers or bullets."
            )
            cleaned = response.text.strip().lower()
            # Additional validation to ensure commas
            if ',' not in cleaned:
                cleaned = re.sub(r'\band\b|\bwith\b', ',', cleaned)  # Split on 'and'/'with'
            return cleaned
        except Exception as e:
            # Enhanced fallback cleaning: Split on conjunctions and punctuation
            cleaned = re.sub(r'\b(okay|yes|no|maybe)\b', '', symptoms.lower())
            cleaned = re.sub(r'[^a-zA-Z, ]', '', cleaned)
            # Split on commas or conjunctions
            cleaned = re.split(r',|\band\b|\bwith\b', cleaned)
            cleaned = [s.strip() for s in cleaned if s.strip()]
            return ', '.join(cleaned)

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
            self.conversation_history.append({"role": "user", "text": user_input})
            
            if any(kw in user_input.lower() for kw in ["explain", "detail"]):
                symptoms = self._extract_symptoms_from_history()
                
                if not symptoms:
                    return "Could you please describe your symptoms first?"

                try:
                    cleaned_symptoms = self._clean_symptoms_input(symptoms)
                    
                    if not cleaned_symptoms:
                        return "I need more details about your symptoms to analyze."
                    
                    analyzer = agent2()
                    analysis = analyzer.analyze_symptoms(cleaned_symptoms)
                    
                    # Add null check for analysis
                    if not analysis or "error" in analysis or not analysis.get("diseases"):
                        return "I couldn't analyze those symptoms. Please try to describe them differently."
                    
                    selected = analysis["diseases"][0]
                    return (
                        f"\nBased on your symptoms: {cleaned_symptoms}\n"
                        f"Most Likely Condition: {selected}\n"
                        f"Wikipedia Context:\n{analysis['context']}\n"
                        f"Key Information:\n{analysis['info']}\n"
                    )
                except Exception as e:
                    return f"Analysis error: {str(e)}"

            chat = self.model.start_chat(history=self._format_history())
            
            try:
                # Send message and get response
                response = chat.send_message(user_input) if "symptoms" not in user_input.lower() else ""

                
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
import google.generativeai as genai
import os
import re
from symptom_agent import SymptomAnalyzerAgent as symptom_agent
from dietitian_agent import DietitianAgent as diet_agent
from dotenv import load_dotenv
from typing import Dict, List
from ocr_agent import process_document
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

        self.api_key = os.getenv("GEMINI_API_KEY")
        self._configure_model()
        self.conversation_history: List[Dict[str, str]] = []
        self.last_symptoms = ""
        self.waiting_for_follow_up = None
        self.suggestion_count = 0
        self.waiting_for_prescription = False

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
        
    def _extract_health_condition(self):
        """Extract medical conditions using symptom analysis"""
        try:
            symptoms = self._extract_symptoms_from_history()
            if not symptoms: return None
            
            response = self.model.generate_content(
                f"Based on these symptoms: {symptoms}\n"
                "What are 2 most likely medical conditions? Respond ONLY with comma-separated condition names."
            )
            return response.text.split(",")[0].strip()  # Return first condition
        except:
            return None
    
    def _get_dietary_advice(self, condition: str = None) -> str:
        """Get dietary advice with inferred condition fallback"""
        if not condition:
            condition = self._extract_health_condition() or "your symptoms"
        
        try:
            dietitian = diet_agent()
            analysis = dietitian.analyze_diet(condition)
            
            # Always include disclaimer
            disclaimer = "\n[Note: These are general dietary suggestions. For personalized recommendations, please consult a healthcare provider for proper diagnosis.]\n"

            if analysis.get("error"):
                return "I couldn't generate specific dietary advice. Here are general recommendations:\n" + \
                    f"{disclaimer}\n" + \
                    f"Breakfast: {analysis['recommendations']['breakfast']}\n" + \
                    f"Lunch: {analysis['recommendations']['lunch']}\n" + \
                    f"Dinner: {analysis['recommendations']['dinner']}"

            # Format special considerations with newlines
            considerations = "\n".join(analysis['considerations']) if isinstance(analysis['considerations'], list) else analysis['considerations']
            
            return (
                f"{disclaimer}\n"
                f"Dietary Recommendations for {condition.capitalize()}:\n"
                f"Recommended Foods:\n" + '\n'.join(analysis['recommended_foods']) + "\n\n"
                f"Avoid:\n" + '\n'.join(analysis['avoid_foods']) + "\n\n"
                f"Sample Meal Plan:\n"
                f"- Breakfast: {analysis['meal_plan']['breakfast']}\n"
                f"- Lunch: {analysis['meal_plan']['lunch']}\n"
                f"- Dinner: {analysis['meal_plan']['dinner']}\n\n"
                f"Special Considerations:\n{considerations}"
            )
        
        except Exception as e:
            return f"Could not generate diet plan: {str(e)}"

    def _format_history(self):
        return [
            {
                "role": "user" if msg["role"] == "user" else "model",
                "parts": [msg["text"]]
            }
            for msg in self.conversation_history
        ]

    def _add_suggestion(self, response: str, user_input: str) -> str:
        """Modified suggestion system"""
        if self.suggestion_count >= 2:
            return response
            
        has_medical_context = any([
            self._extract_symptoms_from_history(),
            self._extract_health_condition(),
            any(kw in user_input.lower() for kw in ["report", "prescription"])
        ])
        
        if has_medical_context and not any(kw in user_input.lower() for kw in ["diet", "symptom", "analysis", "scan"]):
            self.suggestion_count += 1
            return (f"{response}\n\n[Note: I can help with:"
                    "\n1. Symptom analysis"
                    "\n2. Dietary recommendations"
                    "\n3. Prescription scanning]")
        
        return response

    def _get_agent_response(self, query: str) -> str:
        """Route specific requests to appropriate agents"""
        query = query.lower()
        
        if any(kw in query for kw in ["symptom", "analysis", "diagnos"]):
            symptoms = self._extract_symptoms_from_history()
            if symptoms:
                cleaned = self._clean_symptoms_input(symptoms)
                analysis = symptom_agent().analyze_symptoms(cleaned)
                return f"Detailed Analysis:\n{analysis.get('info', 'Analysis unavailable')}"
            return "Could not find symptoms to analyze"

        if any(kw in query for kw in ["diet", "nutrition", "meal"]):
            condition = self._extract_health_condition()
            if not condition:
                condition = "general symptoms"
            return self._get_dietary_advice(condition)
        
        if any(kw in query for kw in ["prescription", "scan", "document"]):
            self.waiting_for_prescription = True
            return "Please share the file path of your prescription/document."

        return None
    
    def _process_prescription(self, file_path: str) -> str:
        """Handle prescription analysis"""
        try:
            raw_result = process_document(file_path)
            
            # Structure the summary
            summary_prompt = (
                f"Analyze this prescription data:\n{raw_result}\n\n"
                "Provide a patient-friendly summary including:\n"
                "- Patient and doctor details\n"
                "- Main diagnosis/condition\n"
                "- Prescribed medications\n"
                "- Key instructions\n"
                "- Additional notes\n"
                "- Suggested condition this prescription treats"
            )
            
            response = self.model.generate_content(summary_prompt)
            return f"Prescription Summary:\n{response.text}\n\nRemember to consult your doctor about any medications!"
        
        except Exception as e:
            return f"Error processing prescription: {str(e)}"
        
    def process_message(self, user_input: str) -> str:
        try:

            if self.waiting_for_prescription:
                self.waiting_for_prescription = False
                prescription_summary = self._process_prescription(user_input)
                self.conversation_history.append({"role": "assistant", "text": prescription_summary})
                return prescription_summary
            
            # Add user input to conversation history
            self.conversation_history.append({"role": "user", "text": user_input})

            # Check if the user is making a direct request for agent-specific functionality
            agent_response = self._get_agent_response(user_input)
            if agent_response:
                self.conversation_history.append({"role": "assistant", "text": agent_response})
                return agent_response

            # If not a direct agent request, proceed with normal chat flow
            chat = self.model.start_chat(history=self._format_history())
            response = chat.send_message(user_input)
            base_response = response.text if response.text else "I couldn't generate a response. Please rephrase."

            # Add a non-intrusive suggestion if relevant
            final_response = self._add_suggestion(base_response, user_input)

            # Add the bot's response to the conversation history
            self.conversation_history.append({"role": "assistant", "text": final_response})
            return final_response

        except Exception as e:
            return f"Error: {str(e)}"

        
    def _add_follow_up_prompt(self, response_text: str) -> tuple:
        """Append follow-up question if condition/symptoms exist"""
        condition = self._extract_health_condition()
        symptoms = self._extract_symptoms_from_history()
        
        if condition or symptoms:
            follow_up = "\n\nWould you like:\n1. Detailed symptom analysis\n2. Dietary recommendations?"
            return (response_text + follow_up, True)
        return (response_text, False)

    def _handle_follow_up(self, user_input: str) -> str:
        """Route follow-up responses to appropriate agents"""
        self.waiting_for_follow_up = False  # Reset state
        
        # Extract condition/symptoms from history
        condition = self._extract_health_condition()
        symptoms = self._extract_symptoms_from_history()
        
        if not condition and not symptoms:
            return "Could not identify condition/symptoms for analysis."

        # Route to appropriate agent
        if "1" in user_input or "detailed" in user_input.lower():
            if symptoms:
                cleaned = self._clean_symptoms_input(symptoms)
                analysis = symptom_agent().analyze_symptoms(cleaned)
                return f"Detailed Analysis:\n{analysis.get('info', 'Unavailable')}"
            return "No symptoms found for analysis."
        
        elif "2" in user_input or "diet" in user_input.lower():
            if condition:
                return self._get_dietary_advice(condition)
            return "Could not determine condition for dietary advice."
        
        return "Please specify: 1 for analysis or 2 for dietary advice."

if __name__ == "__main__":
    bot = HealthcareChatAgent()
    print("Healthcare Assistant: Hello! How can I assist you today? (Type 'exit' to quit)")
    
    while True:
        user_input = input("You: ")
        if user_input.lower() in ['exit', 'quit']:
            print("Assistant: Stay healthy!")
            break
            
        # Handle file paths differently if waiting for prescription
        if bot.waiting_for_prescription:
            response = bot.process_message(user_input)
        else:
            # Normal text processing
            response = bot.process_message(user_input)
            
        print(f"\nAssistant: {response}\n") 
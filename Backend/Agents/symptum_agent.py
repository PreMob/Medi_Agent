import google.generativeai as genai
import wikipedia
import os
import re
from dotenv import load_dotenv
from typing import Dict, List, Union

load_dotenv()

class SymptomAnalyzerAgent:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        self._configure_model()
        
    def _configure_model(self):
        """Configure the Gemini model with safety settings"""
        genai.configure(api_key=self.api_key)
        self.safety_settings = {
            "HARM_CATEGORY_DANGEROUS_CONTENT": "BLOCK_ONLY_HIGH",
            "HARM_CATEGORY_HARASSMENT": "BLOCK_NONE",
            "HARM_CATEGORY_HATE_SPEECH": "BLOCK_NONE",
            "HARM_CATEGORY_SEXUALLY_EXPLICIT": "BLOCK_NONE"
        }
        self.model = genai.GenerativeModel('gemini-2.0-flash')

    def _clean_disease_list(self, text: str) -> List[str]:
        """Clean and format the disease list response"""
        return [disease.strip() for disease in re.split(r'\d+\.|,', text) if disease.strip()]

    def analyze_symptoms(self, symptoms: str) -> Dict[str, Union[List[str], str]]:
        """Process symptoms and return disease information"""
        try:
            # Get potential diseases
            response = self.model.generate_content(
                f"List 3 most likely medical conditions matching: {symptoms}. "
                "Format as numbered list. Example:\n1. Common cold\n2. Influenza\n3. Allergy",
                safety_settings=self.safety_settings
            )
            diseases = self._clean_disease_list(response.text)[:3]

            # Get detailed information for first disease
            if diseases:
                primary_disease = diseases[0]
                return {
                    "diseases": diseases,
                    "context": self._get_disease_context(primary_disease),
                    "info": self._get_disease_info(primary_disease),
                    "error": None
                }
            return {"error": "No conditions identified"}

        except Exception as e:
            return {"error": str(e)}

    def _get_disease_context(self, disease_name: str) -> str:
        """Fetch disease info from Wikipedia"""
        try:
            return wikipedia.summary(disease_name, sentences=3)
        except:
            return "No additional context available"

    def _get_disease_info(self, disease_name: str) -> str:
        """Get structured disease information"""
        try:
            response = self.model.generate_content(
                f"Explain {disease_name} in this concise structure:\n"
                "1. Main Symptoms\n2. Common Treatments\n3. Prevention Tips\n4. When to See a Doctor",
                safety_settings=self.safety_settings
            )
            return response.text
        except Exception as e:
            return f"Information unavailable: {str(e)}"

# Example usage in a multi-agent system
if __name__ == "__main__":
    # Simulating input from another agent
    class SymptomCollectorAgent:
        def collect(self):
            return "headache, fever, cough"

    collector = SymptomCollectorAgent()
    analyzer = SymptomAnalyzerAgent()
    
    results = analyzer.analyze_symptoms(collector.collect())
    
    if not results["error"]:
        print(f"Identified Conditions: {results['diseases']}")
        print(f"\nContext: {results['context']}")
        print(f"\nDetailed Info:\n{results['info']}")
    else:
        print(f"Error: {results['error']}")
import google.generativeai as genai
import wikipedia
import os
import re
from dotenv import load_dotenv
from typing import Dict, List, Union
from Backend.core.v1.common.logger import get_logger

load_dotenv()
logger = get_logger(__name__)

class SymptomAnalyzerAgent:
    def __init__(self):
        try:
            self.api_key = os.getenv("GEMINI_API_KEY")
            if not self.api_key:
                logger.error("Missing GEMINI_API_KEY in environment variables")
                raise ValueError("GEMINI_API_KEY not found in environment variables")
            self._configure_model()
            logger.info("SymptomAnalyzerAgent initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize SymptomAnalyzerAgent: {str(e)}")
            raise
        
    def _configure_model(self):
        """Configure the Gemini model with safety settings"""
        try:
            genai.configure(api_key=self.api_key)
            self.safety_settings = {
                "HARM_CATEGORY_DANGEROUS_CONTENT": "BLOCK_ONLY_HIGH",
                "HARM_CATEGORY_HARASSMENT": "BLOCK_NONE",
                "HARM_CATEGORY_HATE_SPEECH": "BLOCK_NONE",
                "HARM_CATEGORY_SEXUALLY_EXPLICIT": "BLOCK_NONE"
            }
            self.model = genai.GenerativeModel('gemini-2.0-flash')
            logger.debug("Gemini model configured successfully")
        except Exception as e:
            logger.error(f"Failed to configure Gemini model: {str(e)}")
            raise

    def _clean_disease_list(self, text: str) -> List[str]:
        """Clean and format the disease list response"""
        return [disease.strip() for disease in re.split(r'\d+\.|,', text) if disease.strip()]

    def analyze_symptoms(self, symptoms: str) -> Dict[str, Union[List[str], str]]:
        """Process symptoms and return disease information"""
        try:
            response = self.model.generate_content(
                f"List 3 most likely MEDICAL CONDITIONS matching: {symptoms}\n"
                "Format as numbered list using ONLY standard medical terms.\n"
                "Example:\n1. Hemorrhoids\n2. Anal fissure\n3. Colorectal cancer\n\n"
                "Rules:\n- Exclude non-disease responses\n- No markdown formatting\n- Only list conditions"
            )
            # Add additional validation
            diseases = [d for d in self._clean_disease_list(response.text) if d.lower() not in ["okay", "normal"]]
            
            if not diseases:
                return {"error": "No valid conditions identified"}
            
            # Add this missing section to return proper analysis
            primary_disease = diseases[0]
            return {
                "diseases": diseases,
                "context": self._get_disease_context(primary_disease),
                "info": self._get_disease_info(primary_disease),
                "error": None
            }
        
        except Exception as e:
            logger.error(f"Failed to analyze symptoms: {str(e)}")
            return {"error": str(e)}
        
    def _get_disease_context(self, disease_name: str) -> str:
        """Fetch disease info from Wikipedia"""
        try:
            return wikipedia.summary(disease_name, sentences=3)
        except Exception as e:
            logger.error(f"Failed to fetch disease context from Wikipedia: {str(e)}")
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
            logger.error(f"Failed to fetch disease information: {str(e)}")
            return f"Information unavailable: {str(e)}"
        
    def _clean_disease_list(self, text: str) -> List[str]:
        """Clean and validate disease list response"""
        forbidden_terms = ["okay", "normal", "unknown", "healthy", "possible", "conditions", "include"]
        # Split on various delimiters and numbering formats
        diseases = re.split(r'\d+[\.\)]|,|\n|-|•|\*', text)
        cleaned_diseases = []
        for d in diseases:
            d = d.strip()
            # Filter invalid entries
            if d and not any(term in d.lower() for term in forbidden_terms):
                # Remove trailing punctuation
                d = re.sub(r'[^a-zA-Z\s]', '', d)
                if d:
                    cleaned_diseases.append(d)
        return cleaned_diseases[:3]

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
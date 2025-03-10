import google.generativeai as genai
import os
import re
from dotenv import load_dotenv
from typing import Dict, List, Union

load_dotenv()

class DietitianAgent:
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
        self.default_advice = {
            "recommended_foods": ["Vegetables", "Whole grains", "Lean proteins"],
            "avoid_foods": ["Sugary drinks", "Processed snacks", "Trans fats"],
            "meal_plan": {
                "breakfast": "Oatmeal with nuts and berries",
                "lunch": "Grilled chicken salad with olive oil dressing",
                "dinner": "Baked salmon with quinoa and steamed vegetables"
            },
            "considerations": ["Monitor carbohydrate intake", "Stay hydrated"]
        }

    def analyze_diet(self, condition: str) -> Dict[str, Union[List[str], str]]:
        """Generate dietary recommendations based on condition/symptoms"""
        try:
            response = self.model.generate_content(
                f"Provide detailed dietary recommendations for {condition} using this exact structure:\n\n"
                "Recommended Foods: comma-separated list\n"
                "Avoid Foods: comma-separated list\n"
                "Sample Meal Plan:\n"
                "Breakfast: description\n"
                "Lunch: description\n"
                "Dinner: description\n"
                "Special Considerations: numbered list\n\n"
                "Use only food-related terms. No markdown or special formatting.",
                safety_settings=self.safety_settings
            )
            
            return self._parse_response(response.text)
        except Exception as e:
            return {
                "error": str(e),
                **self.default_advice
            }

    def _parse_response(self, text: str) -> Dict:
        """Parse Gemini response into structured format"""
        try:
            # Normalize text and split into lines
            lines = [line.strip() for line in text.split('\n') if line.strip()]
            
            recommendations = {
                "recommended_foods": [],
                "avoid_foods": [],
                "meal_plan": {
                    "breakfast": "",
                    "lunch": "",
                    "dinner": ""
                },
                "considerations": [],
                "error": None
            }

            current_section = None
            
            for line in lines:
                if line.lower().startswith("recommended foods:"):
                    current_section = "recommended"
                    recommendations["recommended_foods"] = self._split_items(line.split(":", 1)[1])
                elif line.lower().startswith("avoid foods:"):
                    current_section = "avoid"
                    recommendations["avoid_foods"] = self._split_items(line.split(":", 1)[1])
                elif line.lower().startswith("breakfast:"):
                    recommendations["meal_plan"]["breakfast"] = line.split(":", 1)[1].strip()
                elif line.lower().startswith("lunch:"):
                    recommendations["meal_plan"]["lunch"] = line.split(":", 1)[1].strip()
                elif line.lower().startswith("dinner:"):
                    recommendations["meal_plan"]["dinner"] = line.split(":", 1)[1].strip()
                elif line.lower().startswith("special considerations:"):
                    current_section = "considerations"
                    recommendations["considerations"] = self._split_items(line.split(":", 1)[1])
                elif current_section == "recommended":
                    recommendations["recommended_foods"].extend(self._split_items(line))
                elif current_section == "avoid":
                    recommendations["avoid_foods"].extend(self._split_items(line))
                elif current_section == "considerations":
                    recommendations["considerations"].extend(self._split_items(line))

            # Validate and fallback to default if empty
            if not recommendations["recommended_foods"]:
                recommendations["recommended_foods"] = self.default_advice["recommended_foods"]
            if not recommendations["avoid_foods"]:
                recommendations["avoid_foods"] = self.default_advice["avoid_foods"]

        # Process special considerations with improved formatting
            if isinstance(recommendations["considerations"], list):
                # Clean and format considerations
                clean_considerations = []
                seen = set()
                
                for item in recommendations["considerations"]:
                    # Remove any existing bullet points or numbers
                    clean_item = re.sub(r'^(\d+\.?|•|\-)\s*', '', str(item)).strip()
                    
                    # Filter valid considerations
                    if clean_item and len(clean_item) > 10:  # Minimum meaningful length
                        # Fix common word breaks and typos
                        clean_item = clean_item.replace("labelealth", "labels for heart health")
                        
                        # Capitalize first letter and add period
                        clean_item = clean_item[0].upper() + clean_item[1:]
                        if not clean_item.endswith(('.', '!', '?')):
                            clean_item += '.'
                            
                        # Remove duplicates
                        if clean_item not in seen:
                            seen.add(clean_item)
                            clean_considerations.append(f"• {clean_item}")

                # Limit to 5 most important points
                recommendations["considerations"] = clean_considerations[:5]

            # Format food lists as bullet points
            for category in ["recommended_foods", "avoid_foods"]:
                if isinstance(recommendations[category], list):
                    recommendations[category] = [
                        f"• {item.strip()}" 
                        for item in recommendations[category][:6]  # Limit to 6 items per category
                        if item.strip()
                    ]    
            return recommendations
            
        except Exception as e:
            return {
                "error": f"Parse error: {str(e)}",
                **self.default_advice
            }

    def _split_items(self, text: str) -> List[str]:
        """Split comma/period separated items with cleanup"""
        items = re.split(r'[,•]|\d+\.', text)
        return [item.strip() for item in items if item.strip()]
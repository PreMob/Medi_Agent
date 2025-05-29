import google.generativeai as genai
# from PIL import Image
import PyPDF2
from pdf2image import convert_from_path
import os
import easyocr
import io
from dotenv import load_dotenv

load_dotenv()
# Initialize EasyOCR reader
reader = easyocr.Reader(['en'])

# Configure Gemini
api_key1 = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key1)
model = genai.GenerativeModel('gemini-2.0-flash')

def extract_text_from_image(image_path):
    """Extract text from image files using EasyOCR"""
    try:
        result = reader.readtext(image_path, detail=0)
        return " ".join(result)
    except Exception as e:
        return f"OCR Error: {str(e)}"

def extract_text_from_pdf(pdf_path):
    """Extract text from PDF files using EasyOCR"""
    text = ""
    try:
        # Try text extraction first
        with open(pdf_path, 'rb') as file:
            reader_pdf = PyPDF2.PdfReader(file)
            for page in reader_pdf.pages:
                text += page.extract_text() or ""
                
        # If no text found, use OCR
        if not text.strip():
            images = convert_from_path(pdf_path)
            for img in images:
                img_byte_arr = io.BytesIO()
                img.save(img_byte_arr, format='PNG')
                result = reader.readtext(img_byte_arr.getvalue(), detail=0)
                text += " ".join(result)
                
    except Exception as e:
        print(f"Error processing PDF: {e}")
    return text

def generate_summary(text):
    """Generate structured summary using Gemini"""
    prompt = """Analyze this medical document and extract:
    1. Patient Info (Name, Age, Gender)
    2. Doctor Info (Name, Contact)
    3. Medications (Name, Dosage, Frequency)
    4. Instructions
    5. Diagnosis
    6. Important Notes
    7. Date of Issue
    
    Format as JSON. Mark unclear fields as 'N/A'.
    
    Document: {text}"""
    
    try:
        response = model.generate_content(prompt.format(text=text))
        return response.text
    except Exception as e:
        return f"Error generating summary: {e}"

def process_document(file_path):
    """Main processing function"""
    if not os.path.exists(file_path):
        return "File not found"
    
    text = ""
    if file_path.lower().endswith(('.png', '.jpg', '.jpeg')):
        text = extract_text_from_image(file_path)
    elif file_path.lower().endswith('.pdf'):
        text = extract_text_from_pdf(file_path)
    else:
        return "Unsupported file format"
    
    if not text.strip():
        return "No text could be extracted"
    
    return generate_summary(text)

# result = process_document("Medi_Agent\Backend\core\pres1.jpg")
# print(result)
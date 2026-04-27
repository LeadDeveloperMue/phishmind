"""
gemini.py

Handles integration with Google Gemini API to generate phishing simulations dynamically.
"""
import os
import json
import logging
from fastapi import HTTPException
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini with the API key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
else:
    logging.warning("GEMINI_API_KEY is not set.")

def clean_json_response(text: str) -> str:
    """
    Strips markdown JSON fences (e.g., ```json ... ```) from the Gemini response.
    """
    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```"):
        text = text[3:]
    
    if text.endswith("```"):
        text = text[:-3]
        
    return text.strip()

def generate_phishing_email(role: str, industry: str, attack_type: str) -> dict:
    """
    Generates a realistic but safe phishing email simulation using Gemini.
    Returns a dict with subject, body, sender_name, sender_email, cta_text, and red_flags.
    """
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # We explicitly instruct the model to return raw JSON and nothing else.
        prompt = f"""
        You are a cybersecurity expert designing a safe, educational phishing simulation.
        Target Employee Role: {role}
        Target Industry: {industry}
        Attack Type: {attack_type}
        
        Create a convincing phishing email tailored to this profile.
        You must return ONLY a raw JSON object with the following keys, without any markdown formatting or comments:
        {{
            "subject": "The email subject line",
            "body": "The HTML body of the email (exclude the call-to-action button, just provide the message content)",
            "sender_name": "A convincing fake sender name",
            "sender_email": "A convincing fake sender email address",
            "cta_text": "Text for the call-to-action button (e.g. 'View Invoice', 'Reset Password')",
            "red_flags": ["A list of 2-3 clues that identify this as a phishing attempt"]
        }}
        """
        
        response = model.generate_content(prompt)
        raw_json = clean_json_response(response.text)
        
        # Parse the JSON
        data = json.loads(raw_json)
        return data
    except Exception as e:
        logging.error(f"Gemini API error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate phishing content")

"""
email.py

Handles sending emails via the Resend API.
"""
import os
import logging
import resend
from dotenv import load_dotenv

load_dotenv()

resend.api_key = os.getenv("RESEND_API_KEY")
FROM_EMAIL = os.getenv("RESEND_FROM_EMAIL", "simulation@phishmind.local")

def send_phishing_simulation(to_email: str, subject: str, html_body: str, tracking_url: str, button_text: str = "Click Here") -> bool:
    """
    Sends a phishing simulation email to the target employee using Resend.
    Injects a tracking URL as a CTA button.
    
    NOTE: This is strictly for authorized simulation and training purposes.
    """
    try:
        # Inject the CTA button
        cta_html = f'''
        <div style="margin-top: 30px; margin-bottom: 30px; text-align: center;">
            <a href="{tracking_url}" style="background-color: #0056b3; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
                {button_text}
            </a>
        </div>
        '''
        
        full_html = f'''
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto;">
            {html_body}
            {cta_html}
            <div style="margin-top: 50px; font-size: 10px; color: #999; border-top: 1px solid #eee; padding-top: 10px;">
                CONFIDENTIALITY NOTICE: This email and any attachments are confidential and may also be privileged.
            </div>
        </div>
        '''

        params = {
            "from": FROM_EMAIL,
            "to": [to_email],
            "subject": subject,
            "html": full_html
        }
        
        # Only send if API key is configured (prevents crashes in dev if missing)
        if not resend.api_key:
            logging.warning(f"Simulating email send to {to_email} (RESEND_API_KEY not set)")
            return True

        resend.Emails.send(params)
        return True
    except Exception as e:
        logging.error(f"Error sending email to {to_email}: {str(e)}")
        return False

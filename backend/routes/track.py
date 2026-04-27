"""
track.py

Handles tracking clicks and reports from the phishing emails.
Updates risk scores and redirects as needed.
"""
import os
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from database import get_db
from models import Campaign, Employee, ClickEvent
from services.scoring import update_risk_score, get_risk_label, generate_risk_explanation

router = APIRouter(prefix="/api/track", tags=["track"])

def process_event(db: Session, campaign_id: str, employee_id: str, action: str):
    """
    Helper function to record an event and update the employee's risk score.
    """
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    
    if not campaign or not employee:
        raise HTTPException(status_code=404, detail="Campaign or Employee not found")
        
    # Prevent duplicate events for the same campaign/employee/action
    existing_event = db.query(ClickEvent).filter(
        ClickEvent.campaign_id == campaign_id,
        ClickEvent.employee_id == employee_id,
        ClickEvent.action == action
    ).first()
    
    if not existing_event:
        # Create event
        new_event = ClickEvent(
            campaign_id=campaign.id,
            employee_id=employee.id,
            action=action,
            attack_type=campaign.attack_type
        )
        db.add(new_event)
        
        # Update score
        new_score = update_risk_score(employee.risk_score, action)
        new_label = get_risk_label(new_score)
        new_explanation = generate_risk_explanation(
            score=new_score,
            label=new_label,
            last_action=action,
            attack_type=campaign.attack_type
        )
        
        employee.risk_score = new_score
        employee.risk_label = new_label
        employee.risk_explanation = new_explanation
        
        db.commit()
        
    return campaign, employee

@router.get("/click/{campaign_id}/{employee_id}")
def log_click(campaign_id: str, employee_id: str, db: Session = Depends(get_db)):
    """
    Logs a click event, updates risk score, and redirects to the frontend training page.
    """
    campaign, employee = process_event(db, campaign_id, employee_id, "clicked")
    
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    # Redirect to a training page specific to the attack type
    safe_attack_type = campaign.attack_type.lower().replace(" ", "-")
    redirect_url = f"{frontend_url}/training/{safe_attack_type}"
    
    return RedirectResponse(url=redirect_url)

@router.get("/report/{campaign_id}/{employee_id}")
def log_report(campaign_id: str, employee_id: str, db: Session = Depends(get_db)):
    """
    Logs a report event, updates risk score, and returns a confirmation JSON.
    """
    campaign, employee = process_event(db, campaign_id, employee_id, "reported")
    
    return {
        "status": "success",
        "message": "Thank you for reporting this phishing simulation. Your vigilance keeps us safe!"
    }

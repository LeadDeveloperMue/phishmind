"""
campaigns.py

Handles Campaign management and launching operations.
"""
import os
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import Campaign, CampaignTarget, Employee
from schemas import Campaign as CampaignSchema, CampaignCreate, CampaignDetail, CampaignStatusUpdate
from services.gemini import generate_phishing_email
from services.email import send_phishing_simulation

router = APIRouter(prefix="/api/campaigns", tags=["campaigns"])

@router.post("/", response_model=CampaignSchema)
def create_campaign(campaign: CampaignCreate, db: Session = Depends(get_db)):
    """
    Creates a new draft campaign and targets all active employees by default.
    """
    new_campaign = Campaign(**campaign.model_dump(), status="draft")
    db.add(new_campaign)
    db.commit()
    db.refresh(new_campaign)
    
    # Automatically add all employees as targets for the MVP
    employees = db.query(Employee).all()
    for emp in employees:
        target = CampaignTarget(campaign_id=new_campaign.id, employee_id=emp.id)
        db.add(target)
    
    db.commit()
    return new_campaign

@router.get("/", response_model=List[CampaignSchema])
def list_campaigns(db: Session = Depends(get_db)):
    """
    Lists all campaigns.
    """
    return db.query(Campaign).order_by(Campaign.created_at.desc()).all()

@router.get("/{id}", response_model=CampaignDetail)
def get_campaign(id: str, db: Session = Depends(get_db)):
    """
    Gets campaign details, including targets and recorded click/report events.
    """
    campaign = db.query(Campaign).filter(Campaign.id == id).first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign

@router.post("/{id}/launch")
def launch_campaign(id: str, db: Session = Depends(get_db)):
    """
    Launches a draft campaign. For each target, generates a custom phishing email via Gemini
    and sends it via Resend.
    """
    campaign = db.query(Campaign).filter(Campaign.id == id).first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
        
    if campaign.status != "draft":
        raise HTTPException(status_code=400, detail="Only draft campaigns can be launched")
        
    targets = db.query(CampaignTarget).filter(CampaignTarget.campaign_id == id).all()
    base_url = os.getenv("BASE_URL", "http://localhost:8000")
    
    sent_count = 0
    for target in targets:
        employee = db.query(Employee).filter(Employee.id == target.employee_id).first()
        if not employee:
            continue
            
        # 1. Generate content with Gemini
        generated_content = generate_phishing_email(
            role=employee.role,
            industry=employee.industry,
            attack_type=campaign.attack_type
        )
        
        # 2. Construct tracking URL
        tracking_url = f"{base_url}/api/track/click/{campaign.id}/{employee.id}"
        
        # 3. Send email via Resend
        success = send_phishing_simulation(
            to_email=employee.email,
            subject=generated_content.get("subject", "Important Notice"),
            html_body=generated_content.get("body", "<p>Please click the button below.</p>"),
            tracking_url=tracking_url,
            button_text=generated_content.get("cta_text", "Action Required")
        )
        
        if success:
            target.email_sent = True
            target.email_sent_at = datetime.utcnow()
            sent_count += 1
            
    campaign.status = "active"
    db.commit()
    
    return {"message": f"Campaign launched. Emails sent to {sent_count}/{len(targets)} targets."}

@router.patch("/{id}/status", response_model=CampaignSchema)
def update_campaign_status(id: str, update: CampaignStatusUpdate, db: Session = Depends(get_db)):
    """
    Updates the status of a campaign (e.g. from active to completed).
    """
    campaign = db.query(Campaign).filter(Campaign.id == id).first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
        
    campaign.status = update.status
    db.commit()
    db.refresh(campaign)
    return campaign

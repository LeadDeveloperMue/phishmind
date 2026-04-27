"""
scores.py

Endpoints for retrieving risk scores and aggregated statistics.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from database import get_db
from models import Employee, ClickEvent, Campaign
from schemas import Employee as EmployeeSchema, ScoreSummary

router = APIRouter(prefix="/api/scores", tags=["scores"])

@router.get("/", response_model=List[EmployeeSchema])
def get_all_scores(db: Session = Depends(get_db)):
    """
    Returns all employees ranked by risk score (descending order).
    """
    return db.query(Employee).order_by(Employee.risk_score.desc()).all()

@router.get("/summary", response_model=ScoreSummary)
def get_score_summary(db: Session = Depends(get_db)):
    """
    Returns aggregated stats for the dashboard: 
    avg score, highest risk employee, total clicks, total reports, total campaigns.
    """
    # Average score
    avg_score_result = db.query(func.avg(Employee.risk_score)).scalar()
    avg_score = float(avg_score_result) if avg_score_result else 0.0
    
    # Highest risk employee
    highest_risk_employee = db.query(Employee).order_by(Employee.risk_score.desc()).first()
    
    # Total clicks and reports
    total_clicks = db.query(ClickEvent).filter(ClickEvent.action == "clicked").count()
    total_reports = db.query(ClickEvent).filter(ClickEvent.action == "reported").count()
    
    # Total campaigns
    total_campaigns = db.query(Campaign).count()
    
    return ScoreSummary(
        average_score=avg_score,
        highest_risk_employee=highest_risk_employee,
        total_clicks=total_clicks,
        total_reports=total_reports,
        total_campaigns=total_campaigns
    )

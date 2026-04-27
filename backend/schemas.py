"""
schemas.py

Contains all Pydantic models for request/response validation.
"""
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

# =======================
# Employee Schemas
# =======================
class EmployeeBase(BaseModel):
    name: str = Field(..., example="Jane Doe")
    email: EmailStr = Field(..., example="jane.doe@company.com")
    role: str = Field(..., example="Accountant")
    industry: str = Field(..., example="Fintech")

class EmployeeCreate(EmployeeBase):
    pass

class Employee(EmployeeBase):
    id: str
    risk_score: int
    risk_label: str
    risk_explanation: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# =======================
# Campaign Schemas
# =======================
class CampaignBase(BaseModel):
    name: str = Field(..., example="Q3 Invoice Phishing")
    attack_type: str = Field(..., example="Invoice Fraud")

class CampaignCreate(CampaignBase):
    pass

class Campaign(CampaignBase):
    id: str
    channel: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class CampaignStatusUpdate(BaseModel):
    status: str = Field(..., example="completed")

# =======================
# CampaignTarget Schemas
# =======================
class CampaignTarget(BaseModel):
    id: str
    campaign_id: str
    employee_id: str
    email_sent: bool
    email_sent_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# =======================
# ClickEvent Schemas
# =======================
class ClickEvent(BaseModel):
    id: str
    campaign_id: str
    employee_id: str
    action: str
    attack_type: str
    timestamp: datetime

    class Config:
        from_attributes = True

# =======================
# Combined/Detailed Schemas
# =======================
class EmployeeDetail(Employee):
    click_events: List[ClickEvent] = []

    class Config:
        from_attributes = True

class CampaignDetail(Campaign):
    targets: List[CampaignTarget] = []
    click_events: List[ClickEvent] = []

    class Config:
        from_attributes = True

# =======================
# Simulation & Preview Schemas
# =======================
class PreviewRequest(BaseModel):
    role: str = Field(..., example="Accountant")
    industry: str = Field(..., example="Fintech")
    attack_type: str = Field(..., example="Invoice Fraud")

class PreviewResponse(BaseModel):
    subject: str
    body: str
    sender_name: str
    sender_email: str
    red_flags: List[str]

# =======================
# Score & Stat Schemas
# =======================
class ScoreSummary(BaseModel):
    average_score: float
    highest_risk_employee: Optional[Employee]
    total_clicks: int
    total_reports: int
    total_campaigns: int

"""
models.py

Contains all SQLAlchemy ORM models representing the database tables.
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Employee(Base):
    __tablename__ = "employees"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    role = Column(String, nullable=False)
    industry = Column(String, nullable=False)
    risk_score = Column(Integer, default=0, nullable=False) # 0-100
    risk_label = Column(String, default="Low Risk", nullable=False)
    risk_explanation = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    campaign_targets = relationship("CampaignTarget", back_populates="employee", cascade="all, delete-orphan")
    click_events = relationship("ClickEvent", back_populates="employee", cascade="all, delete-orphan")

class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    attack_type = Column(String, nullable=False)
    channel = Column(String, default="email", nullable=False)
    status = Column(String, default="draft", nullable=False) # draft | active | completed
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    targets = relationship("CampaignTarget", back_populates="campaign", cascade="all, delete-orphan")
    click_events = relationship("ClickEvent", back_populates="campaign", cascade="all, delete-orphan")

class CampaignTarget(Base):
    __tablename__ = "campaign_targets"

    id = Column(String, primary_key=True, default=generate_uuid)
    campaign_id = Column(String, ForeignKey("campaigns.id"), nullable=False)
    employee_id = Column(String, ForeignKey("employees.id"), nullable=False)
    email_sent = Column(Boolean, default=False, nullable=False)
    email_sent_at = Column(DateTime, nullable=True)

    # Relationships
    campaign = relationship("Campaign", back_populates="targets")
    employee = relationship("Employee", back_populates="campaign_targets")

class ClickEvent(Base):
    __tablename__ = "click_events"

    id = Column(String, primary_key=True, default=generate_uuid)
    campaign_id = Column(String, ForeignKey("campaigns.id"), nullable=False)
    employee_id = Column(String, ForeignKey("employees.id"), nullable=False)
    action = Column(String, nullable=False) # clicked | reported | ignored
    attack_type = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    campaign = relationship("Campaign", back_populates="click_events")
    employee = relationship("Employee", back_populates="click_events")

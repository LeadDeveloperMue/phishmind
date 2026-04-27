"""
seed.py

Script to seed demo data for hackathon presentation.
Creates 6 diverse employees and 2 campaigns (1 active, 1 completed) with simulated click events.
"""
import uuid
from datetime import datetime, timedelta
from database import SessionLocal, engine, Base
from models import Employee, Campaign, CampaignTarget, ClickEvent
from services.scoring import update_risk_score, get_risk_label, generate_risk_explanation

def reset_db():
    print("Dropping and recreating all tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

def seed_data():
    db = SessionLocal()
    
    # 1. Create Employees
    print("Seeding employees...")
    emp_data = [
        {"name": "Alice Smith", "email": "alice@phishmind.local", "role": "Accountant", "industry": "Fintech"},
        {"name": "Bob Johnson", "email": "bob@phishmind.local", "role": "HR Manager", "industry": "Healthcare"},
        {"name": "Charlie Davis", "email": "charlie@phishmind.local", "role": "Software Engineer", "industry": "E-commerce"},
        {"name": "Diana Prince", "email": "diana@phishmind.local", "role": "CEO", "industry": "Fintech"},
        {"name": "Eve Adams", "email": "eve@phishmind.local", "role": "Customer Support", "industry": "E-commerce"},
        {"name": "Frank Castle", "email": "frank@phishmind.local", "role": "Finance Director", "industry": "Healthcare"},
    ]
    
    employees = []
    for data in emp_data:
        emp = Employee(
            id=str(uuid.uuid4()),
            name=data["name"],
            email=data["email"],
            role=data["role"],
            industry=data["industry"],
            risk_score=0,
            risk_label="Low Risk",
            risk_explanation="Newly added to the system."
        )
        db.add(emp)
        employees.append(emp)
    
    db.commit()
    
    # 2. Create Campaigns
    print("Seeding campaigns...")
    now = datetime.utcnow()
    
    # Completed Campaign
    camp_completed = Campaign(
        id=str(uuid.uuid4()),
        name="Q1 Urgent Invoice Check",
        attack_type="Invoice Fraud",
        channel="email",
        status="completed",
        created_at=now - timedelta(days=30)
    )
    
    # Active Campaign
    camp_active = Campaign(
        id=str(uuid.uuid4()),
        name="Mandatory HR Policy Update",
        attack_type="IT Urgency",
        channel="email",
        status="active",
        created_at=now - timedelta(days=2)
    )
    
    db.add_all([camp_completed, camp_active])
    db.commit()
    
    # 3. Create Campaign Targets
    print("Seeding targets...")
    for emp in employees:
        db.add(CampaignTarget(campaign_id=camp_completed.id, employee_id=emp.id, email_sent=True, email_sent_at=now - timedelta(days=29)))
        db.add(CampaignTarget(campaign_id=camp_active.id, employee_id=emp.id, email_sent=True, email_sent_at=now - timedelta(days=1)))
    
    db.commit()
    
    # 4. Simulate Events and Update Scores
    print("Seeding click events and updating scores...")
    
    def simulate_event(emp, camp, action):
        db.add(ClickEvent(
            id=str(uuid.uuid4()),
            campaign_id=camp.id,
            employee_id=emp.id,
            action=action,
            attack_type=camp.attack_type,
            timestamp=now - timedelta(days=15 if camp.status == "completed" else 0)
        ))
        
        emp.risk_score = update_risk_score(emp.risk_score, action)
        emp.risk_label = get_risk_label(emp.risk_score)
        emp.risk_explanation = generate_risk_explanation(emp.risk_score, emp.risk_label, action, camp.attack_type)
        db.commit()

    # Bob fell for both
    simulate_event(employees[1], camp_completed, "clicked")
    simulate_event(employees[1], camp_active, "clicked")
    
    # Alice fell for invoice, reported HR
    simulate_event(employees[0], camp_completed, "clicked")
    simulate_event(employees[0], camp_active, "reported")
    
    # Charlie reported both
    simulate_event(employees[2], camp_completed, "reported")
    simulate_event(employees[2], camp_active, "reported")
    
    # Diana ignored both
    simulate_event(employees[3], camp_completed, "ignored")
    simulate_event(employees[3], camp_active, "ignored")
    
    # Eve fell for HR, ignored invoice
    simulate_event(employees[4], camp_completed, "ignored")
    simulate_event(employees[4], camp_active, "clicked")
    
    # Frank reported invoice, clicked HR
    simulate_event(employees[5], camp_completed, "reported")
    simulate_event(employees[5], camp_active, "clicked")
    
    print("Database seeding completed successfully!")
    db.close()

if __name__ == "__main__":
    reset_db()
    seed_data()

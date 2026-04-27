"""
employees.py

Handles Employee CRUD operations.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import Employee
from schemas import Employee as EmployeeSchema, EmployeeCreate, EmployeeDetail

router = APIRouter(prefix="/api/employees", tags=["employees"])

@router.post("/", response_model=EmployeeSchema)
def create_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):
    """
    Creates a new employee with a default risk score of 0.
    """
    db_emp = db.query(Employee).filter(Employee.email == employee.email).first()
    if db_emp:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    new_emp = Employee(**employee.model_dump())
    new_emp.risk_explanation = "Newly added to the system. Waiting for activity to assess risk."
    
    db.add(new_emp)
    db.commit()
    db.refresh(new_emp)
    return new_emp

@router.get("/", response_model=List[EmployeeSchema])
def list_employees(db: Session = Depends(get_db)):
    """
    Lists all employees with their basic risk scores.
    """
    return db.query(Employee).all()

@router.get("/{id}", response_model=EmployeeDetail)
def get_employee(id: str, db: Session = Depends(get_db)):
    """
    Retrieves a single employee and their full phishing event history.
    """
    emp = db.query(Employee).filter(Employee.id == id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    return emp

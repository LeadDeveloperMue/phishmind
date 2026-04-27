"""
simulate.py

Endpoints for previewing and generating phishing simulations without sending them.
"""
from fastapi import APIRouter
from schemas import PreviewRequest, PreviewResponse
from services.gemini import generate_phishing_email

router = APIRouter(prefix="/api/simulate", tags=["simulate"])

@router.post("/preview", response_model=PreviewResponse)
def preview_simulation(request: PreviewRequest):
    """
    Generates a phishing email via Gemini based on role, industry, and attack type.
    This does not save to the database or send an email. It is used for dashboard previews.
    """
    data = generate_phishing_email(
        role=request.role,
        industry=request.industry,
        attack_type=request.attack_type
    )
    return data

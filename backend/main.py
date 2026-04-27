"""
main.py

Application entry point for the PhishMind AI FastAPI backend.
Configures CORS, creates the database tables, and registers all routers.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
from routes import employees, campaigns, simulate, track, scores

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PhishMind AI API",
    description="Backend for the adaptive phishing simulation and awareness platform.",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(employees.router)
app.include_router(campaigns.router)
app.include_router(simulate.router)
app.include_router(track.router)
app.include_router(scores.router)

@app.get("/")
def read_root():
    """
    Health check endpoint.
    """
    return {"status": "ok", "message": "PhishMind AI API is running."}

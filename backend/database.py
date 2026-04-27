"""
database.py

Sets up the SQLite database connection using SQLAlchemy.
Provides the Base class for models and a dependency function for FastAPI routes.
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Use SQLite for simplicity as requested
SQLALCHEMY_DATABASE_URL = "sqlite:///./phishmind.db"

# connect_args={"check_same_thread": False} is needed only for SQLite. 
# It's not needed for other databases.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """
    Dependency function that yields a database session.
    Ensures the session is closed after the request is finished.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

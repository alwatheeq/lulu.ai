
from sqlalchemy import Column, Integer, String, Float, ForeignKey, JSON, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base_class import Base

class Client(Base):
    id = Column(Integer, primary_key=True, index=True)
    expert_id = Column(Integer, ForeignKey("user.id"))
    user_id = Column(Integer, ForeignKey("user.id"), nullable=True) # ID of the actual user account
    email = Column(String, nullable=True)
    
    name = Column(String, index=True)
    age = Column(Integer)
    weight = Column(Float)
    height = Column(Float, nullable=True)
    goal = Column(String)
    diet = Column(String)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    expert = relationship("User", foreign_keys=[expert_id], back_populates="clients")
    journals = relationship("JournalEntry", back_populates="client", cascade="all, delete-orphan")

class JournalEntry(Base):
    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("client.id"))
    
    timestamp = Column(DateTime, default=datetime.utcnow)
    name = Column(String)
    calories = Column(Integer)
    protein = Column(Float)
    carbs = Column(Float)
    fats = Column(Float)
    meal_type = Column(String, default="Scan Analysis")
    image_url = Column(String, nullable=True)
    health_tip = Column(String, nullable=True)
    
    client = relationship("Client", back_populates="journals")

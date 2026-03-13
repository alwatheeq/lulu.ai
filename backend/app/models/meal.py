
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.base_class import Base

class Meal(Base):
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    name = Column(String, index=True)
    meal_type = Column(String, default="Snack") # Breakfast, Lunch, Dinner, Snack
    image_url = Column(String, nullable=True)
    
    # Nutritional Info
    calories = Column(Integer)
    protein = Column(Float)
    carbs = Column(Float)
    fats = Column(Float)
    
    # Stores the raw AI response or ingredient list as JSON
    ingredients = Column(JSON, nullable=True) 
    health_tip = Column(String, nullable=True)
    
    user = relationship("User", back_populates="meals")

# Add back_populates to User model if not already added (I need to modify User)

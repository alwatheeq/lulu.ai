from sqlalchemy import Boolean, Column, Integer, String, Enum, Float
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class User(Base):
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    role = Column(String, default="user") # user, admin, coach, nutritionist
    
    # Profile Data
    weight = Column(Float, nullable=True) # in kg
    height = Column(Float, nullable=True) # in cm
    age = Column(Integer, nullable=True)
    gender = Column(String, nullable=True)
    activity_level = Column(String, default="Sedentary")
    goal = Column(String, default="Maintain")
    plan = Column(String, default="Free")
    image_url = Column(String, nullable=True)

    # Relationships
    meals = relationship("Meal", back_populates="user")
    water_logs = relationship("Water", back_populates="user")
    clients = relationship("Client", foreign_keys="Client.expert_id", back_populates="expert")


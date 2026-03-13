from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from datetime import datetime

# Shared properties
class MealBase(BaseModel):
    name: str
    meal_type: Optional[str] = "Snack"
    calories: Optional[float] = 0
    protein: Optional[float] = 0
    carbs: Optional[float] = 0
    fats: Optional[float] = 0
    image_url: Optional[str] = None
    ingredients: Optional[List[Dict[str, Any]]] = None
    health_tip: Optional[str] = None

# Properties to receive on item creation
class MealCreate(MealBase):
    pass

# Properties to receive on item update
class MealUpdate(MealBase):
    pass

# Properties shared by models stored in DB
class MealInDBBase(MealBase):
    id: int
    user_id: int
    timestamp: datetime

    class Config:
        from_attributes = True

# Properties to return to client
class Meal(MealInDBBase):
    pass

class MealInDB(MealInDBBase):
    pass

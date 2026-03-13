from typing import Any, List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.api.deps import get_db, get_current_active_superuser
from app.schemas.user import User
from app.models.user import User as UserModel
from app.models.meal import Meal
from app.models.water import Water

router = APIRouter()

@router.get("/users", response_model=List[User])
def read_users(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: UserModel = Depends(get_current_active_superuser),
) -> Any:
    """
    Retrieve users.
    """
    users = db.query(UserModel).offset(skip).limit(limit).all()
    return users

@router.get("/stats", response_model=dict)
def read_stats(
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_superuser),
) -> Any:
    """
    Retrieve system statistics.
    """
    user_count = db.query(func.count(UserModel.id)).scalar()
    meal_count = db.query(func.count(Meal.id)).scalar()
    
    # Calculate revenue (mock logic based on plan)
    pro_users = db.query(func.count(UserModel.id)).filter(UserModel.plan == "Pro").scalar()
    revenue = pro_users * 19.99 # Assuming $20/month for Pro
    
    return {
        "user_count": user_count,
        "meal_count": meal_count,
        "revenue": revenue,
        "active_sessions": 0 # Placeholder
    }

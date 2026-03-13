from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.schemas.water import Water, WaterCreate
from app.models.user import User as UserModel
from app.db.crud_water import water as water_crud

router = APIRouter()

@router.get("/today", response_model=int)
def read_todays_water(
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
) -> Any:
    """
    Get total water intake for today (in mL).
    """
    total = water_crud.get_todays_water(db, user_id=current_user.id)
    return total

@router.post("/", response_model=Water)
def log_water(
    *,
    db: Session = Depends(get_db),
    water_in: WaterCreate,
    current_user: UserModel = Depends(get_current_user),
) -> Any:
    """
    Log water intake.
    """
    water = water_crud.create_with_user(db=db, obj_in=water_in, user_id=current_user.id)
    return water

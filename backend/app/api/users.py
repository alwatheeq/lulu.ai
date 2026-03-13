from typing import Any, List

from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from pydantic.networks import EmailStr
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.db.crud_user import user as user_crud
from app.schemas.user import User, UserCreate, UserUpdate
from app.models.user import User as UserModel

router = APIRouter()

@router.get("/me", response_model=User)
def read_user_me(
    current_user: UserModel = Depends(get_current_user),
) -> Any:
    """
    Get current user.
    """
    return current_user

@router.put("/me", response_model=User)
def update_user_me(
    *,
    db: Session = Depends(get_db),
    user_in: UserUpdate,
    current_user: UserModel = Depends(get_current_user),
) -> Any:
    """
    Update own user.
    """
    user = user_crud.update(db, db_obj=current_user, obj_in=user_in)
    return user

@router.post("/", response_model=User)
def create_user(
    *,
    db: Session = Depends(get_db),
    user_in: UserCreate,
) -> Any:
    """
    Create new user.
    """
    user = user_crud.get_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    user = user_crud.create(db, obj_in=user_in)
    return user
@router.get("/experts", response_model=List[User])
def get_experts(db: Session = Depends(get_db)):
    """
    Get all public health professionals.
    """
    return db.query(UserModel).filter(UserModel.role.in_(["coach", "nutritionist", "expert"])).all()

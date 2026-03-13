from typing import List, Optional, Union, Dict, Any
from sqlalchemy.orm import Session
from fastapi.encoders import jsonable_encoder

from app.models.meal import Meal
from app.schemas.meal import MealCreate, MealUpdate

class CRUDMeal:
    def get(self, db: Session, id: Any) -> Optional[Meal]:
        return db.query(Meal).filter(Meal.id == id).first()

    def get_multi_by_user(
        self, db: Session, *, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[Meal]:
        return (
            db.query(Meal)
            .filter(Meal.user_id == user_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def create_with_user(
        self, db: Session, *, obj_in: MealCreate, user_id: int
    ) -> Meal:
        obj_in_data = jsonable_encoder(obj_in)
        db_obj = Meal(**obj_in_data, user_id=user_id)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(
        self,
        db: Session,
        *,
        db_obj: Meal,
        obj_in: Union[MealUpdate, Dict[str, Any]]
    ) -> Meal:
        obj_data = jsonable_encoder(db_obj)
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        for field in obj_data:
            if field in update_data:
                setattr(db_obj, field, update_data[field])
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def remove(self, db: Session, *, id: int) -> Meal:
        obj = db.query(Meal).get(id)
        if obj:
            db.delete(obj)
            db.commit()
        return obj

meal = CRUDMeal()

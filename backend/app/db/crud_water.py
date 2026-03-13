from typing import List, Optional, Union, Dict, Any
from sqlalchemy.orm import Session
from fastapi.encoders import jsonable_encoder
from datetime import datetime, timedelta

from app.models.water import Water
from app.schemas.water import WaterCreate

class CRUDWater:
    def get_multi_by_user(
        self, db: Session, *, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[Water]:
        return (
            db.query(Water)
            .filter(Water.user_id == user_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
        
    def get_todays_water(self, db: Session, *, user_id: int) -> int:
        today = datetime.utcnow().date()
        logs = db.query(Water).filter(
            Water.user_id == user_id, 
            Water.timestamp >= today
        ).all()
        return sum([log.amount for log in logs])

    def create_with_user(
        self, db: Session, *, obj_in: WaterCreate, user_id: int
    ) -> Water:
        obj_in_data = jsonable_encoder(obj_in)
        db_obj = Water(**obj_in_data, user_id=user_id)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

water = CRUDWater()

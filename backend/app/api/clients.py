
from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.user import User as UserModel
from app.models.client import Client, JournalEntry
from pydantic import BaseModel

router = APIRouter()

# --- Schemas ---
class ClientBase(BaseModel):
    name: str
    age: int
    weight: float
    goal: str
    diet: str
    notes: str = None
    email: str = None

class ClientCreate(ClientBase):
    pass

class ClientResponse(ClientBase):
    id: int
    
    class Config:
        from_attributes = True

class JournalEntryBase(BaseModel):
    name: str
    calories: int
    protein: float
    carbs: float
    fats: float
    meal_type: str = "Scan Analysis"
    image_url: str = None
    health_tip: str = None

class JournalEntryCreate(JournalEntryBase):
    pass

class JournalEntryResponse(JournalEntryBase):
    id: int
    
    class Config:
        from_attributes = True

# --- Endpoints ---
@router.post("/", response_model=dict)
def create_client(
    *,
    db: Session = Depends(get_db),
    client_in: ClientCreate,
    current_user: UserModel = Depends(get_current_user),
) -> Any:
    if current_user.role not in ["coach", "nutritionist", "expert", "admin"]:
        raise HTTPException(status_code=403, detail="Only professional accounts can manage clients")
    
    user_id = None
    if client_in.email:
        user = db.query(UserModel).filter(UserModel.email == client_in.email).first()
        if user:
            user_id = user.id
            
    db_obj = Client(**client_in.model_dump(), expert_id=current_user.id, user_id=user_id)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return {"id": db_obj.id, "name": db_obj.name, "goal": db_obj.goal}

@router.get("/", response_model=List[ClientResponse])
def get_clients(
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
) -> Any:
    return db.query(Client).filter(Client.expert_id == current_user.id).all()

@router.get("/{client_id}/journal", response_model=List[JournalEntryResponse])
def get_client_journal(
    client_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
) -> Any:
    client = db.query(Client).filter(Client.id == client_id, Client.expert_id == current_user.id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return db.query(JournalEntry).filter(JournalEntry.client_id == client_id).order_by(JournalEntry.timestamp.desc()).all()

@router.post("/{client_id}/journal", response_model=dict)
def add_journal_entry(
    client_id: int,
    entry_in: JournalEntryCreate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
) -> Any:
    client = db.query(Client).filter(Client.id == client_id, Client.expert_id == current_user.id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    
    db_obj = JournalEntry(**entry_in.model_dump(), client_id=client_id)
    db.add(db_obj)
    
    if client.user_id:
        from app.models.meal import Meal
        meal_obj = Meal(
            name=entry_in.name,
            calories=entry_in.calories,
            user_id=client.user_id
        )
        db.add(meal_obj)
        
    db.commit()
    db.refresh(db_obj)
    return {"success": True, "id": db_obj.id}

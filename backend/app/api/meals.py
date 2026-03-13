from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.schemas.meal import Meal, MealCreate, MealUpdate
from app.models.user import User as UserModel
from app.db.crud_meal import meal as meal_crud
from app.services.claude_service import analyze_food_image, ask_claude, chat_with_lulu
from pydantic import BaseModel

class AskRequest(BaseModel):
    prompt: str
    max_tokens: int = 4000
    system: str = None

router = APIRouter()

@router.get("/", response_model=List[Meal])
def read_meals(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: UserModel = Depends(get_current_user),
) -> Any:
    """
    Retrieve meals for the current user.
    """
    meals = meal_crud.get_multi_by_user(
        db, user_id=current_user.id, skip=skip, limit=limit
    )
    return meals

@router.post("/", response_model=Meal)
def create_meal(
    *,
    db: Session = Depends(get_db),
    meal_in: MealCreate,
    current_user: UserModel = Depends(get_current_user),
) -> Any:
    """
    Create new meal.
    """
    meal = meal_crud.create_with_user(db=db, obj_in=meal_in, user_id=current_user.id)
    return meal

@router.put("/{id}", response_model=Meal)
def update_meal(
    *,
    db: Session = Depends(get_db),
    id: int,
    meal_in: MealUpdate,
    current_user: UserModel = Depends(get_current_user),
) -> Any:
    """
    Update a meal.
    """
    meal = meal_crud.get(db=db, id=id)
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")
    if meal.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    meal = meal_crud.update(db=db, db_obj=meal, obj_in=meal_in)
    return meal

@router.delete("/{id}", response_model=Meal)
def delete_meal(
    *,
    db: Session = Depends(get_db),
    id: int,
    current_user: UserModel = Depends(get_current_user),
) -> Any:
    """
    Delete a meal.
    """
    meal = meal_crud.get(db=db, id=id)
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")
    if meal.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    meal = meal_crud.remove(db=db, id=id)
    return meal

@router.post("/scan")
async def scan_meal_image(
    file: UploadFile = File(...),
    current_user: UserModel = Depends(get_current_user),
) -> Any:
    """
    Scan a food image using Claude AI to extract nutritional information.
    Returns detailed nutrition data including calories, macros, and ingredients.
    """
    # Validate file type
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(
            status_code=400,
            detail="File must be an image (JPEG, PNG, GIF, or WEBP)"
        )

    try:
        # Read image bytes
        image_bytes = await file.read()

        # Analyze image with Claude
        nutrition_data = await analyze_food_image(image_bytes)

        return {
            "success": True,
            "data": nutrition_data
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to analyze image: {str(e)}"
        )

@router.post("/ask")
async def ask_claude_route(
    request: AskRequest,
    current_user: UserModel = Depends(get_current_user),
) -> Any:
    """
    Send a raw prompt to Claude (used for the Planner and Chat).
    """
    try:
        reply = await ask_claude(request.prompt, request.max_tokens)
        return {"success": True, "reply": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@router.post("/chat")
async def chat_with_lulu_route(
    request: AskRequest,
    current_user: UserModel = Depends(get_current_user),
) -> Any:
    """
    Chat with Lulu AI.
    """
    try:
        reply = await chat_with_lulu(request.prompt)
        return {"response": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

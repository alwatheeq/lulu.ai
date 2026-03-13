from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from google.oauth2 import id_token
from google.auth.transport import requests
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core import auth, security
from app.db.crud_user import user as user_crud
from app.api.deps import get_db
from app.core.config import settings
from app.schemas.user import UserCreate

class GoogleLoginRequest(BaseModel):
    token: str

router = APIRouter()


@router.post("/login/access-token")
def login_access_token(
    db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = user_crud.get_by_email(db, email=form_data.username)
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password",
        )
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
        
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": auth.create_access_token(
            {"sub": str(user.id)}, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.post("/login/google")
def login_google(
    request: GoogleLoginRequest,
    db: Session = Depends(get_db)
) -> Any:
    """
    Verify Google ID token and return a Lulu AI access token.
    """
    try:
        # Verify the ID token
        idinfo = id_token.verify_oauth2_token(
            request.token, requests.Request(), settings.GOOGLE_CLIENT_ID
        )

        # ID token is valid. Check if user exists
        email = idinfo['email']
        user = user_crud.get_by_email(db, email=email)

        if not user:
            # Create user if doesn't exist
            user_in = UserCreate(
                email=email,
                full_name=idinfo.get('name', ''),
                password=security.get_password_hash(security.generate_password()), # Random password for OAuth users
                is_active=True,
                role="user"
            )
            user = user_crud.create(db, obj_in=user_in)

        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        return {
            "access_token": auth.create_access_token(
                {"sub": str(user.id)}, expires_delta=access_token_expires
            ),
            "token_type": "bearer",
        }
    except ValueError:
        # Invalid token
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google token",
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal Server Error: {str(e)}"
        )

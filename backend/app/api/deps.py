from fastapi import Depends, HTTPException, Request, Response, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.security import (
    ACCESS_COOKIE,
    REFRESH_COOKIE,
    create_access_token,
    create_refresh_token,
    decode_token,
)
from app.models.user import User
from app.schemas.user import UserPublic


def set_auth_cookies(response: Response, user_id: int, remember: bool = False) -> None:
    access = create_access_token(str(user_id))
    refresh = create_refresh_token(str(user_id))
    access_max_age = settings.access_token_expire_minutes * 60
    refresh_max_age = settings.refresh_token_expire_days * 86400
    if not remember:
        refresh_max_age = settings.access_token_expire_minutes * 60

    common = {
        "httponly": True,
        "secure": settings.cookie_secure,
        "samesite": "lax",
        "path": "/",
    }
    response.set_cookie(ACCESS_COOKIE, access, max_age=access_max_age, **common)
    response.set_cookie(REFRESH_COOKIE, refresh, max_age=refresh_max_age, **common)


def clear_auth_cookies(response: Response) -> None:
    response.delete_cookie(ACCESS_COOKIE, path="/")
    response.delete_cookie(REFRESH_COOKIE, path="/")


def _user_from_token(token: str | None, db: Session, expected_type: str) -> User:
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    payload = decode_token(token)
    if not payload or payload.get("type") != expected_type:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    user_id = payload.get("sub")
    user = db.get(User, int(user_id))
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    return user


def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    return _user_from_token(request.cookies.get(ACCESS_COOKIE), db, "access")


def get_current_user_public(user: User = Depends(get_current_user)) -> UserPublic:
    return UserPublic.model_validate(user)

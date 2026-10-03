from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user_public
from app.core.database import get_db
from app.core.security import hash_password, verify_password
from app.models.user import User
from app.schemas.user import ChangePasswordRequest, ProfileUpdateRequest, UserPublic
from app.services import email_service

router = APIRouter(prefix="/api/users", tags=["users"])


@router.put("/profile", response_model=UserPublic)
def update_profile(
    body: ProfileUpdateRequest,
    db: Session = Depends(get_db),
    current: UserPublic = Depends(get_current_user_public),
):
    user = db.get(User, current.id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    user.name = body.name.strip()
    db.commit()
    db.refresh(user)
    return UserPublic.model_validate(user)


@router.post("/change-password")
async def change_password(
    body: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current: UserPublic = Depends(get_current_user_public),
):
    user = db.get(User, current.id)
    if not user or not verify_password(body.current_password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect.",
        )
    user.password_hash = hash_password(body.new_password)
    db.commit()
    await email_service.send_password_changed_email(user.email)
    return {"message": "Password updated"}

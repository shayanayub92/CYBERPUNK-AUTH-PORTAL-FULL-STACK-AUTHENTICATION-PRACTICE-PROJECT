from datetime import datetime

from pydantic import BaseModel, EmailStr, Field, field_validator


class UserPublic(BaseModel):
    id: int
    name: str
    email: EmailStr
    is_email_verified: bool
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class LoginResponse(BaseModel):
    user: UserPublic
    message: str = "Login successful"


class ProfileUpdateRequest(BaseModel):
    name: str = Field(min_length=1, max_length=120)


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(min_length=8, max_length=128)
    confirm_password: str

    @field_validator("confirm_password")
    @classmethod
    def passwords_match(cls, v, info):
        if "new_password" in info.data and v != info.data["new_password"]:
            raise ValueError("Password and confirm password must match")
        return v

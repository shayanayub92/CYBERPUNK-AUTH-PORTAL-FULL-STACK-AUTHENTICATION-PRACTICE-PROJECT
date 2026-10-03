import logging

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.orm import Session

from app.api.deps import clear_auth_cookies, get_current_user_public, set_auth_cookies
from app.core.config import settings
from app.core.database import get_db
from app.core.security import (
    ACCESS_COOKIE,
    REFRESH_COOKIE,
    create_access_token,
    decode_token,
    hash_password,
    verify_password,
)

logger = logging.getLogger(__name__)
from app.models.user import User
from app.schemas.auth import (
    EmailOtpRequest,
    ForgotPasswordRequest,
    LoginRequest,
    MessageResponse,
    RegisterRequest,
    ResendVerificationRequest,
    ResetPasswordRequest,
    VerifyResetOtpRequest,
)
from app.schemas.user import LoginResponse, UserPublic
from app.services import email_service, otp_service

router = APIRouter(prefix="/api/auth", tags=["auth"])

VERIFY_PREFIX = "verify_otp"
RESET_PREFIX = "reset_otp"


@router.post("/register", response_model=MessageResponse)
async def register(body: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == body.email.lower()).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email is already registered")

    user = User(
        name=body.name.strip(),
        email=body.email.lower(),
        password_hash=hash_password(body.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    otp = otp_service.generate_and_store(VERIFY_PREFIX, user.email, rate_prefix="verify_rate")
    await email_service.send_verification_email(user.email, otp)
    if not settings.smtp_host:
        logger.info("SMTP not configured — verification OTP for %s: %s", user.email, otp)
    return MessageResponse(message="Registration successful. Please verify your email.")


@router.post("/verify-email", response_model=MessageResponse)
async def verify_email(body: EmailOtpRequest, db: Session = Depends(get_db)):
    email = body.email.lower()
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found")
    if user.is_email_verified:
        return MessageResponse(message="Email already verified")

    otp_service.verify_and_consume(VERIFY_PREFIX, email, body.otp)
    user.is_email_verified = True
    db.commit()
    await email_service.send_welcome_email(user.email, user.name)
    return MessageResponse(message="Email verified successfully")


@router.post("/resend-verification", response_model=MessageResponse)
async def resend_verification(body: ResendVerificationRequest, db: Session = Depends(get_db)):
    email = body.email.lower()
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found")
    if user.is_email_verified:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already verified")

    otp = otp_service.generate_and_store(VERIFY_PREFIX, email, rate_prefix="verify_rate")
    await email_service.send_verification_email(email, otp)
    return MessageResponse(message="Verification code sent")


@router.post("/login", response_model=LoginResponse)
def login(body: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email.lower()).first()
    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed. Check your credentials and try again.",
        )
    if not user.is_email_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please verify your email before logging in.",
        )
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is inactive")

    set_auth_cookies(response, user.id, remember=body.remember)
    return LoginResponse(user=UserPublic.model_validate(user))


@router.post("/refresh", response_model=MessageResponse)
def refresh_token(request: Request, response: Response, db: Session = Depends(get_db)):
    token = request.cookies.get(REFRESH_COOKIE)
    payload = decode_token(token) if token else None
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    user = db.get(User, int(payload["sub"]))
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    access = create_access_token(str(user.id))
    response.set_cookie(
        ACCESS_COOKIE,
        access,
        max_age=settings.access_token_expire_minutes * 60,
        httponly=True,
        secure=settings.cookie_secure,
        samesite="lax",
        path="/",
    )
    return MessageResponse(message="Token refreshed")


@router.post("/logout", response_model=MessageResponse)
def logout(response: Response):
    clear_auth_cookies(response)
    return MessageResponse(message="Logged out")


@router.get("/me", response_model=UserPublic)
def me(user: UserPublic = Depends(get_current_user_public)):
    return user


@router.post("/forgot-password", response_model=MessageResponse)
async def forgot_password(body: ForgotPasswordRequest, db: Session = Depends(get_db)):
    email = body.email.lower()
    user = db.query(User).filter(User.email == email).first()
    if user:
        otp = otp_service.generate_and_store(RESET_PREFIX, email, rate_prefix="reset_rate")
        await email_service.send_password_reset_email(email, otp)
        if not settings.smtp_host:
            logger.info("SMTP not configured — password reset OTP for %s: %s", email, otp)
    return MessageResponse(
        message="If an account exists for this email, a recovery code has been sent.",
    )


@router.post("/verify-reset-otp", response_model=MessageResponse)
def verify_reset_otp(body: VerifyResetOtpRequest, db: Session = Depends(get_db)):
    email = body.email.lower()
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Verification code is incorrect.")
    otp_service.verify_otp(RESET_PREFIX, email, body.otp, consume=False)
    return MessageResponse(message="OTP verified. Complete password reset.")


@router.post("/reset-password", response_model=MessageResponse)
async def reset_password(body: ResetPasswordRequest, response: Response, db: Session = Depends(get_db)):
    email = body.email.lower()
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Verification code is incorrect.")

    otp_service.verify_and_consume(RESET_PREFIX, email, body.otp)
    user.password_hash = hash_password(body.new_password)
    db.commit()
    otp_service.delete_otp(RESET_PREFIX, email)
    clear_auth_cookies(response)
    await email_service.send_password_changed_email(user.email)
    return MessageResponse(message="Password reset successful")

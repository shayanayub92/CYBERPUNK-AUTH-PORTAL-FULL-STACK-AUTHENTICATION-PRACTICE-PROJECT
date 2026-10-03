import hashlib
import secrets

from fastapi import HTTPException, status

from app.core.config import settings
from app.core.redis_client import get_redis


def _hash_otp(otp: str) -> str:
    return hashlib.sha256(otp.encode()).hexdigest()


def _otp_key(prefix: str, email: str) -> str:
    return f"{prefix}:{email.lower()}"


def _rate_key(prefix: str, email: str) -> str:
    return f"{prefix}_rate:{email.lower()}"


def check_rate_limit(rate_prefix: str, email: str) -> None:
    r = get_redis()
    key = _rate_key(rate_prefix, email)
    count = r.incr(key)
    if count == 1:
        r.expire(key, settings.otp_rate_limit_window_seconds)
    if count > settings.otp_rate_limit_max:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many OTP requests. Please try again later.",
        )


def generate_and_store(prefix: str, email: str, rate_prefix: str | None = None) -> str:
    if rate_prefix:
        check_rate_limit(rate_prefix, email)

    otp = f"{secrets.randbelow(1_000_000):06d}"
    r = get_redis()
    ttl = settings.otp_expire_minutes * 60
    r.setex(_otp_key(prefix, email), ttl, _hash_otp(otp))
    return otp


def verify_otp(prefix: str, email: str, otp: str, *, consume: bool = True) -> None:
    r = get_redis()
    key = _otp_key(prefix, email)
    stored = r.get(key)
    if not stored:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This verification code has expired. Request a new code.",
        )
    if stored != _hash_otp(otp):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification code is incorrect.",
        )
    if consume:
        r.delete(key)


def verify_and_consume(prefix: str, email: str, otp: str) -> None:
    verify_otp(prefix, email, otp, consume=True)


def delete_otp(prefix: str, email: str) -> None:
    get_redis().delete(_otp_key(prefix, email))

import logging
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import aiosmtplib

from app.core.config import settings

logger = logging.getLogger(__name__)


def _base_template(title: str, body_html: str) -> str:
    return f"""
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;background:#030508;font-family:Arial,sans-serif;color:#e2e8f0;padding:32px;">
  <div style="max-width:520px;margin:0 auto;border:1px solid rgba(0,240,255,0.2);border-radius:12px;padding:32px;background:#0a0e1a;">
    <p style="letter-spacing:0.3em;font-size:11px;color:#00f0ff;margin:0 0 8px;">CYBERVAULT</p>
    <h1 style="color:#fff;font-size:22px;margin:0 0 16px;">{title}</h1>
    {body_html}
    <p style="font-size:12px;color:#64748b;margin-top:32px;">Do not share this code. CyberVault will never ask for your password by email.</p>
  </div>
</body>
</html>
"""


async def send_email(to_email: str, subject: str, html: str) -> None:
    if not settings.smtp_host or not settings.smtp_from_email:
        logger.warning("SMTP not configured; email to %s skipped (subject: %s)", to_email, subject)
        return

    message = MIMEMultipart("alternative")
    message["From"] = f"{settings.smtp_from_name} <{settings.smtp_from_email}>"
    message["To"] = to_email
    message["Subject"] = subject
    message.attach(MIMEText(html, "html"))

    await aiosmtplib.send(
        message,
        hostname=settings.smtp_host,
        port=settings.smtp_port,
        username=settings.smtp_username or None,
        password=settings.smtp_password or None,
        start_tls=True,
    )


async def send_verification_email(to_email: str, otp: str) -> None:
    html = _base_template(
        "Verify Your Identity",
        f"""
        <p style="color:#94a3b8;line-height:1.6;">Use this one-time verification code to activate your CyberVault account:</p>
        <p style="font-size:32px;letter-spacing:0.4em;color:#00f0ff;font-weight:bold;text-align:center;margin:24px 0;">{otp}</p>
        <p style="color:#94a3b8;">This code expires in {settings.otp_expire_minutes} minutes.</p>
        """,
    )
    await send_email(to_email, "CyberVault — Verify Your Email", html)


async def send_welcome_email(to_email: str, name: str) -> None:
    html = _base_template(
        "Welcome to CyberVault",
        f"""
        <p style="color:#94a3b8;line-height:1.6;">Hello {name},</p>
        <p style="color:#94a3b8;line-height:1.6;">Your identity has been successfully verified and your account is now active.</p>
        <p style="color:#94a3b8;line-height:1.6;">Secure your sessions and explore your vault dashboard when you're ready.</p>
        """,
    )
    await send_email(to_email, "Welcome to CyberVault", html)


async def send_password_reset_email(to_email: str, otp: str) -> None:
    html = _base_template(
        "Password Recovery",
        f"""
        <p style="color:#94a3b8;line-height:1.6;">A password reset was requested for your CyberVault account.</p>
        <p style="font-size:32px;letter-spacing:0.4em;color:#a855f7;font-weight:bold;text-align:center;margin:24px 0;">{otp}</p>
        <p style="color:#94a3b8;">If you did not request this, you can ignore this email.</p>
        """,
    )
    await send_email(to_email, "CyberVault — Password Reset Code", html)


async def send_password_changed_email(to_email: str) -> None:
    html = _base_template(
        "Password Changed",
        """
        <p style="color:#94a3b8;line-height:1.6;">Your CyberVault password was changed successfully.</p>
        <p style="color:#94a3b8;line-height:1.6;">If this wasn't you, contact support immediately and reset your credentials.</p>
        """,
    )
    await send_email(to_email, "CyberVault — Password Changed", html)

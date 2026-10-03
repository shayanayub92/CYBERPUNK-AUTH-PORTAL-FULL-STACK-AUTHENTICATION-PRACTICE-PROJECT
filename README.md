# CYBERVAULT — Cyberpunk Authentication Portal

**Tagline:** Secure Your Digital Identity

CyberVault is a full-stack authentication practice project with a premium cyberpunk UI, real JWT cookie sessions, Redis OTP flows, and SMTP email delivery.

## Features

- User registration with email verification (6-digit OTP, 5-minute expiry)
- Login with Argon2 password hashing and HTTP-only JWT cookies (access + refresh)
- Forgot password and reset password with OTP
- Resend verification with Redis rate limiting
- Minimal dashboard and profile (name update, change password)
- Interactive 3D hero (React Three Fiber) and Framer Motion animations

## Tech Stack

| Layer | Technologies |
|--------|----------------|
| Frontend | React, Vite, Tailwind CSS, Framer Motion, Three.js, R3F, Axios, React Router |
| Backend | FastAPI, SQLAlchemy, SQLite, Pydantic, JWT, Argon2, Redis, aiosmtplib |

## Architecture

```
frontend/          React SPA (Vite)
backend/app/       FastAPI application
  api/             Route handlers
  core/            Config, DB, security, Redis
  models/          SQLAlchemy models
  schemas/         Pydantic DTOs
  services/        OTP and email business logic
```

Authentication tokens are stored in **HTTP-only cookies**, not `localStorage`. OTP hashes live in **Redis** only.

## Authentication Flow

1. **Signup** → create user → OTP in Redis → verification email → `/verify-email`
2. **Verify** → validate OTP → `is_email_verified=true` → welcome email → login
3. **Login** → credentials check → set cookies → dashboard
4. **Forgot password** → generic response → reset OTP email → `/reset-password`
5. **Logout** → clear cookies

## Environment Setup

Copy examples and fill in secrets:

```bash
cp .env.example backend/.env
cp frontend/.env.example frontend/.env
```

Never commit `.env` files.

### Redis

Install and run Redis locally (default `redis://localhost:6379/0`).

Windows: use [Memurai](https://www.memurai.com/), WSL Redis, or Docker:

```bash
docker compose up -d redis
```

### SMTP

Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `SMTP_FROM_EMAIL` in `backend/.env`.

If SMTP is **not** configured, OTP codes are logged to the **backend console** for local development only.

## Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate    # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Tables are created automatically on startup (`users`).

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/verify-email` | Verify signup OTP |
| POST | `/api/auth/resend-verification` | Resend signup OTP |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Current user |
| POST | `/api/auth/forgot-password` | Request reset OTP |
| POST | `/api/auth/verify-reset-otp` | Validate reset OTP |
| POST | `/api/auth/reset-password` | Reset password |
| PUT | `/api/users/profile` | Update name |
| POST | `/api/users/change-password` | Change password |

## Security Considerations

This project demonstrates common auth patterns for **learning and portfolios**. It is not a certified production security audit. Practices included:

- Argon2 password hashing
- JWT in HttpOnly cookies with SameSite
- OTP hashing in Redis, expiry, one-time use, rate limits
- Generic forgot-password responses
- CORS limited to frontend origin
- No secrets in source control

Use strong `JWT_SECRET_KEY`, enable `COOKIE_SECURE=true` behind HTTPS in production, and configure real SMTP/Redis.

## Screenshots

_Add screenshots of the landing page, login, OTP verification, and dashboard here._

## Future Improvements

- Email change flow with re-verification
- 2FA / TOTP
- Audit log for security events
- Refresh token rotation and denylist
- E2E test suite (Playwright)
- Docker Compose for Redis + API + frontend

## License

MIT — practice and portfolio use.

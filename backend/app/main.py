from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import auth, users
from app.core.config import settings
from app.core.database import Base, engine
from app.models import user  # noqa: F401

app = FastAPI(title="CyberVault API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)


@app.get("/api/health")
def health():
    return {"status": "online", "service": "cybervault"}

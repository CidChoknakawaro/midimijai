# backend/app/main.py
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import create_db_and_tables

# --- Lifespan (recommended over @on_event) ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Safe to call repeatedly; should be idempotent in your DB layer
    create_db_and_tables()
    yield
    # (No teardown needed)

app = FastAPI(lifespan=lifespan)

# --- CORS ---
# Put your deployed Vercel URL in FRONTEND_ORIGIN, e.g. https://myapp.vercel.app
# For local dev, these are also allowed.
VERCEL_ORIGIN = os.getenv("FRONTEND_ORIGIN")  # single origin, e.g. https://myapp.vercel.app
DEV_ORIGINS = {
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
}

allow_origins = [VERCEL_ORIGIN] if VERCEL_ORIGIN else []
allow_origins = list(set(allow_origins) | DEV_ORIGINS)

# If you truly need wildcard in some environments, don’t allow credentials with "*"
ALLOW_ALL = os.getenv("CORS_ALLOW_ALL", "false").lower() == "true"

if ALLOW_ALL:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,  # "*" + credentials is invalid
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allow_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# --- Routers ---
from app.routers.auth    import router as auth_router
from app.routers.users   import router as users_router
from app.routers.midi    import router as midi_router
from app.routers.project import router as projects_router
from app.routers.ai      import router as ai_router

app.include_router(auth_router,     prefix="/auth",     tags=["auth"])
app.include_router(users_router,    prefix="/users",    tags=["users"])
app.include_router(midi_router,     prefix="/midi",     tags=["midi"])
app.include_router(projects_router, prefix="/projects", tags=["projects"])
app.include_router(ai_router,       prefix="/ai",       tags=["ai"])

# --- Health & root (Render will hit /healthz) ---
@app.get("/healthz")
def healthz():
    return {"ok": True}

@app.get("/")
def root():
    return {"message": "MIDIMIJAI backend is running"}

# --- Local run (Render will use Gunicorn/Uvicorn workers instead) ---
if __name__ == "__main__":
    import uvicorn, os
    port = int(os.getenv("PORT", "10000"))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)

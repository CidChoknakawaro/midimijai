import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import create_db_and_tables
from app.routers.auth    import router as auth_router
from app.routers.users   import router as users_router
from app.routers.midi    import router as midi_router
from app.routers.project import router as projects_router
from app.routers.ai      import router as ai_router

app = FastAPI()

# --- CORS ---
VERCEL_ORIGIN = os.getenv("FRONTEND_ORIGIN")  # e.g. https://your-app.vercel.app
DEV_ORIGINS = [
    "http://localhost:5173", "http://127.0.0.1:5173",
    "http://localhost:3000", "http://127.0.0.1:3000",
]
allow_origins = DEV_ORIGINS + ([VERCEL_ORIGIN] if VERCEL_ORIGIN else [])

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    # also allow preview deploys like https://your-app-<hash>-vercel.app
    allow_origin_regex=r"https://.*\.vercel\.app$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# routers
app.include_router(auth_router,     prefix="/auth",     tags=["auth"])
app.include_router(users_router,    prefix="/users",    tags=["users"])
app.include_router(midi_router,     prefix="/midi",     tags=["midi"])
app.include_router(projects_router, prefix="/projects", tags=["projects"])
app.include_router(ai_router,       prefix="/ai",       tags=["ai"])

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/healthz")
def healthz():
    return {"ok": True}

@app.get("/")
def root():
    return {"message": "MIDIMIJAI backend is running"}
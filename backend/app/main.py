# backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import create_db_and_tables

# Explicit router imports:
from app.routers.auth    import router as auth_router
from app.routers.users   import router as users_router
from app.routers.midi    import router as midi_router
from app.routers.project import router as projects_router
from app.routers.ai      import router as ai_router

app = FastAPI()

# Allow frontend access during dev
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all routers
app.include_router(auth_router,     prefix="/auth",     tags=["auth"])
app.include_router(users_router,    prefix="/users",    tags=["users"])
app.include_router(midi_router,     prefix="/midi",     tags=["midi"])
app.include_router(projects_router, prefix="/projects", tags=["projects"])
app.include_router(ai_router,       prefix="/ai",       tags=["ai"])

# Initialize tables on startup (or use Alembic migrations instead)
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/")
def root():
    return {"message": "MIDIMIJAI backend is running"}

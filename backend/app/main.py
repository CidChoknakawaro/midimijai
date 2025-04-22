from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, users, midi
from app.database import create_db_and_tables

app = FastAPI()

# Allow frontend access during dev
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(midi.router, prefix="/midi", tags=["midi"])

# Initialize tables on startup
@app.on_event("startup")
def startup():
    create_db_and_tables()

@app.get("/")
def root():
    return {"message": "MIDIMIJAI backend is running"}

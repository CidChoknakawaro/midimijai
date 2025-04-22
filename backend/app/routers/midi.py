from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.midi import MIDIProjectCreate, MIDIProjectOut
from app.models.midi import MIDIProject
from app.database import get_db

router = APIRouter()

@router.post("/", response_model=MIDIProjectOut)
def create_project(project: MIDIProjectCreate, db: Session = Depends(get_db)):
    db_project = MIDIProject(**project.dict())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@router.get("/", response_model=list[MIDIProjectOut])
def get_projects(db: Session = Depends(get_db)):
    return db.query(MIDIProject).all()

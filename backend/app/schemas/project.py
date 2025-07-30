from datetime import datetime
from pydantic import BaseModel
from typing import List, Any, Optional

class TrackSchema(BaseModel):
    id: str
    name: str
    instrument: str
    notes: List[Any]  # you can make this more specific

class ProjectBase(BaseModel):
    name: str
    data: dict  # {"bpm": int, "tracks": List[TrackSchema]}

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    name: Optional[str]
    data: Optional[dict]

class ProjectInDB(ProjectBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

from pydantic import BaseModel

class MIDIProjectCreate(BaseModel):
    name: str
    data: dict
    user_id: int

class MIDIProjectOut(MIDIProjectCreate):
    id: int

    class Config:
        orm_mode = True

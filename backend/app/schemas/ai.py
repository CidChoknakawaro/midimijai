from pydantic import BaseModel
from typing import Optional, Dict, Any

class AIGenerateRequest(BaseModel):
    prompt: str
    length_beats: Optional[int] = 64
    temperature: Optional[float] = 1.0

class AIGenerateResponse(BaseModel):
    data: Dict[str, Any]
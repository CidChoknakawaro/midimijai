from pydantic import BaseModel
from typing import Optional, Dict, Any, Literal

AIMode = Literal[
    "suggest",
    "generate",
    "modify-suggest",
    "modify",
    "style-suggest",
    "style",
]

class AIGenerateRequest(BaseModel):
    prompt: str
    mode: Optional[AIMode] = None
    length_beats: Optional[int] = 64
    temperature: Optional[float] = 1.0

class AIGenerateResponse(BaseModel):
    # either suggestions or data (project-shaped)
    suggestions: Optional[list[str]] = None
    data: Optional[Dict[str, Any]] = None

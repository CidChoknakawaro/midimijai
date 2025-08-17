# app/routers/ai.py
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, Literal, Dict, Any, List

from app.services.ai_service import (
    generate_midi_from_prompt,
    suggest_from_prompt,
    modify_from_prompt,
    style_from_prompt,
)

# If you already have auth dependency, import it; else stub a permissive one for local tests
try:
    from app.core.dependencies import get_current_user
except Exception:
    def get_current_user():  # type: ignore
        return {"username": "dev"}

router = APIRouter(tags=["ai"])

class GenerateRequest(BaseModel):
    prompt: str
    mode: Literal["generate", "suggest", "modify", "style"] = "generate"
    length_beats: Optional[int] = 64
    temperature: Optional[float] = 1.0

@router.post("/generate")
def ai_generate(body: GenerateRequest, user: Dict[str, Any] = Depends(get_current_user)):
    if not body.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt is required.")
    if body.mode == "suggest":
        suggestions = suggest_from_prompt(body.prompt)
        return {"suggestions": suggestions}
    if body.mode == "modify":
        data = modify_from_prompt(body.prompt)
        return {"data": data}
    if body.mode == "style":
        data = style_from_prompt(body.prompt)
        return {"data": data}
    # default = "generate"
    data = generate_midi_from_prompt(
        body.prompt,
        length_beats=body.length_beats or 64,
        temperature=body.temperature or 1.0,
    )
    return {"data": data}

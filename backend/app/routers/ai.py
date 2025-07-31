from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Any

from app.database import get_db
from app.core.security import get_current_user
from app.schemas.ai import AIGenerateRequest, AIGenerateResponse
from app.services.ai_service import generate_midi_from_prompt

router = APIRouter(tags=["ai"])

@router.post(
    "/generate",
    response_model=AIGenerateResponse,
    dependencies=[Depends(get_current_user)]
)
def ai_generate(
    payload: AIGenerateRequest,
    db: Session = Depends(get_db),
) -> Any:
    try:
        data = generate_midi_from_prompt(
            prompt=payload.prompt,
            length_beats=payload.length_beats,
            temperature=payload.temperature
        )
        return {"data": data}
    except Exception as e:
        raise HTTPException(500, detail=str(e))
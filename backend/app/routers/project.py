from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.project import Project as ProjectModel
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectInDB
from app.core.security import get_current_user

router = APIRouter(
    tags=["projects"],
)


@router.get("/", response_model=List[ProjectInDB])
def list_projects(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    return (
        db.query(ProjectModel)
        .filter(ProjectModel.owner_id == current_user.id)
        .all()
    )


@router.post("/", response_model=ProjectInDB)
def create_project(
    payload: ProjectCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    proj = ProjectModel(owner_id=current_user.id, **payload.dict())
    db.add(proj)
    db.commit()
    db.refresh(proj)
    return proj


@router.get("/{project_id}", response_model=ProjectInDB)
def get_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    proj = (
        db.query(ProjectModel)
        .filter(
            ProjectModel.id == project_id,
            ProjectModel.owner_id == current_user.id,
        )
        .first()
    )
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
    return proj


@router.put("/{project_id}", response_model=ProjectInDB)
def update_project(
    project_id: int,
    payload: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    q = (
        db.query(ProjectModel)
        .filter(
            ProjectModel.id == project_id,
            ProjectModel.owner_id == current_user.id,
        )
    )
    if not q.first():
        raise HTTPException(status_code=404, detail="Project not found")
    q.update(payload.dict(exclude_none=True))
    db.commit()
    return q.first()


@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    q = (
        db.query(ProjectModel)
        .filter(
            ProjectModel.id == project_id,
            ProjectModel.owner_id == current_user.id,
        )
    )
    if not q.first():
        raise HTTPException(status_code=404, detail="Project not found")
    q.delete()
    db.commit()
    return {"ok": True}
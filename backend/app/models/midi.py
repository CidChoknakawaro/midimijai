from sqlalchemy import Column, Integer, String, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class MIDIProject(Base):
    __tablename__ = "midi_projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    data = Column(JSON)
    user_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="projects")

from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    midi_projects = relationship("MIDIProject", back_populates="owner", cascade="all, delete")

    projects = relationship("Project", back_populates="owner", cascade="all, delete")
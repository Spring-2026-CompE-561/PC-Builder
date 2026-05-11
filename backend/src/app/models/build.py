from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Boolean,
    ForeignKey,
    DateTime,
    Text,
    Enum as SAEnum,
)
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base
import enum


class UseCase(str, enum.Enum):
    GAMING = "gaming"
    WORKSTATION = "workstation"
    OFFICE = "office"
    BUDGET = "budget"
    VIDEO_EDITING = "video_editing"
    PROGRAMMING = "programming"
    GENERAL = "general"


class Build(Base):
    __tablename__ = "builds"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    name = Column(String(200), default="My Build")
    use_case = Column(SAEnum(UseCase), nullable=True)  # nullable so manual builds work
    budget = Column(Float)
    notes = Column(Text)  # added notes field
    is_public = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="builds")
    build_parts = relationship(
        "BuildPart", back_populates="build", cascade="all, delete-orphan"
    )


class BuildPart(Base):
    __tablename__ = "build_parts"

    id = Column(Integer, primary_key=True, index=True)
    build_id = Column(Integer, ForeignKey("builds.id", ondelete="CASCADE"))
    part_id = Column(Integer, ForeignKey("parts.id", ondelete="CASCADE"))
    quantity = Column(Integer, default=1)  # fixed typo from quanity
    note = Column(String(300))

    build = relationship("Build", back_populates="build_parts")
    part = relationship("Part", back_populates="build_parts")

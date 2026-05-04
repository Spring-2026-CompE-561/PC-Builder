from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Boolean,
    ForeignKey,
    DateTime,
    Enum as SAEnum,
)
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

import enum


class UseCase(str, enum.Enum):  # id the case of the build for user
    GAMING = "Gaming"
    WORK = "Work"
    OFFICE = "office"
    CONTENT_CREATOR = "Content Creator"
    GENERAL = "General"


class Build(Base):  # user's build
    __tablename__ = "builds"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True
    )  # who saved the build
    name = Column(String(200), default="My Build")
    use_case = Column(SAEnum(UseCase), nullable=False)  # use case id from earlier
    budget = Column(Float)  # cost/budget of build
    is_public = Column(Boolean, default=False)  # share feature
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="builds")
    build_parts = relationship(
        "BuildPart", back_populates="build", cascade="all, delete-orphan"
    )  # cascade="all, delete-orphan" removes all parts if build is deleted


class BuildPart(Base):  # details of the build
    __tablename__ = "build_parts"

    id = Column(Integer, primary_key=True, index=True)
    build_id = Column(
        Integer, ForeignKey("builds.id", ondelete="CASCADE")
    )  # what build it is
    part_id = Column(Integer, ForeignKey("parts.id", ondelete="CASCADE"))  # part id
    quanity = Column(Integer, default=1)  # quantity of spef part
    note = Column(String(300))  # notes for the build

    build = relationship("Build", back_populates="build_parts")
    part = relationship("Part", back_populates="build_parts")

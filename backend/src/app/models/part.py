from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Boolean,
    ForeignKey,
    JSON,
    DateTime,
    Enum as SAEnum,
)
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

import enum


class PartType(str, enum.Enum):
    CPU = "cpu"
    GPU = "gpu"
    RAM = "ram"
    STORAGE = "storage"
    MOTHERBOARD = "motherboard"
    POWER_SUPPLY = "psu"
    CASE = "case"
    COOLER = "cooler"


class Part(Base):
    __tablename__ = "parts"

    id = Column(Integer, primary_key=True, index=True)  # id of the part
    name = Column(String(100), nullable=False)  # name of part
    brand = Column(String(100))  # brand of part
    category = Column(SAEnum(PartType), nullable=False, index=True)  # part type
    specs = Column(
        JSON
    )  # unsure if we need specs for user, id the socket type, num of cores, ect.
    image_url = Column(String(500))  # image of part
    is_active = Column(
        Boolean, default=True
    )  # confirm if part is used or can be deleted b4 confriming
    created_at = Column(
        DateTime, default=datetime.utcnow
    )  # change PST?, time of when added/created

    pricing = relationship(
        "Pricing", back_populates="part", uselist=False
    )  # adds to pricing
    build_parts = relationship("BuildPart", back_populates="part")  # link to part


class Pricing(Base):
    __tablename__ = "pricing"

    id = Column(Integer, primary_key=True, index=True)
    part_id = Column(Integer, ForeignKey("parts.id", onupdate="CASCADE"), unique=True)
    price = Column(Float, nullable=False)
    currency = Column(
        String(3), default="USD"
    )  # currency of part in USD, add euros later?
    in_stock = Column(Boolean, default=True)  # checks if part is in stock
    updated_at = Column(DateTime, default=datetime.utcnow)  # time of list last updated

    part = relationship("Part", back_populates="pricing")


PartCategory = PartType

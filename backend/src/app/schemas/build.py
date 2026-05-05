from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.part import PartCategory
from app.models.build import UseCase


# rep single part within the build
class BuildPartOut(BaseModel):
    part_id: int
    part_name: str
    category: Optional[PartCategory] = None
    quantity: int
    unit_price: Optional[float] = None
    subtotal: Optional[float] = None

    model_config = {"from_attributes": True}


# list of the Full build that is sent to the frontend
class BuildOut(BaseModel):
    id: int
    name: str
    use_case: Optional[UseCase] = None
    budget: Optional[float] = None
    total_cost: float
    parts: list[BuildPartOut]
    created_at: datetime

    model_config = {"from_attributes": True}


# Info sent for manual selection part
class BuildCreate(BaseModel):
    name: Optional[str] = "My Build"
    use_case: Optional[UseCase] = None
    budget: Optional[float] = None
    notes: Optional[str] = None
    part_ids: list[int]


# guided flow for build
class GeneratorRequest(BaseModel):
    budget: float
    use_case: UseCase
    preferred_brands: Optional[list[str]] = None


# checks the compatibility of parts
class CompatibilityCheckRequest(BaseModel):
    part_ids: list[int]

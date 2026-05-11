from pydantic import BaseModel
from typing import Optional, Any
from app.models.part import PartCategory


# sent to fronted when parts are requested
class PartOut(BaseModel):
    id: int
    name: str
    brand: Optional[str] = None
    category: PartCategory
    specs: Optional[Any] = None
    image_url: Optional[str] = None
    price: Optional[float] = None
    in_stock: Optional[bool] = None
    compatibility: Optional[str] = None

    model_config = {"from_attributes": True}


# sent to backend when adding new parts
class PartCreate(BaseModel):
    name: str
    brand: Optional[str] = None
    category: PartCategory
    specs: Optional[Any] = None
    image_url: Optional[str] = None
    price: float = None
    in_stock: bool = None

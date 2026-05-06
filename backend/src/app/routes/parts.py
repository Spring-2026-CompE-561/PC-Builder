from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import Optional

from app.core.database import get_db
from app.models.part import Part, Pricing, PartCategory
from app.schemas.part import PartOut, PartCreate

# countiues filters when returning to parts
router = APIRouter(prefix="/parts", tags=["parts"])


def _enrich(part: Part) -> dict:
    return {
        "id": part.id,
        "name": part.name,
        "brand": part.brand,
        "category": part.category,
        "specs": part.specs,
        "image_url": part.image_url,
        "price": part.pricing.price if part.pricing else None,
        "in_stock": part.pricing.in_stock if part.pricing else None,
    }


# list part
def _filter_parts(parts: list[Part], max_price: Optional[float], in_stock_only: bool) -> list[dict]:
    results = []
    for p in parts:
        e = _enrich(p)
        if max_price and e["price"] and e["price"] > max_price:
            continue
        if in_stock_only and not e.get("in_stock"):
            continue
        results.append(e)
    return results


@router.get("/", response_model=list[PartOut])
def list_parts(
    category: Optional[PartCategory] = None,
    max_price: Optional[float] = None,
    brand: Optional[str] = None,
    in_stock_only: bool = False,
    db: Session = Depends(get_db),
):
    q = db.query(Part).options(joinedload(Part.pricing)).filter(Part.is_active)
    if category:
        q = q.filter(Part.category == category)
    if brand:
        q = q.filter(Part.brand.ilike(f"%{brand}%"))

    parts = q.all()
    return _filter_parts(parts, max_price, in_stock_only)


@router.get("/category/{category}", response_model=list[PartOut])
def list_parts_by_category(
    category: PartCategory,
    max_price: Optional[float] = None,
    brand: Optional[str] = None,
    in_stock_only: bool = False,
    db: Session = Depends(get_db),
):
    q = (
        db.query(Part)
        .options(joinedload(Part.pricing))
        .filter(Part.is_active, Part.category == category)
    )
    if brand:
        q = q.filter(Part.brand.ilike(f"%{brand}%"))

    parts = q.all()
    return _filter_parts(parts, max_price, in_stock_only)


# part router
@router.get("/{part_id}", response_model=PartOut)
def get_part(part_id: int, db: Session = Depends(get_db)):
    part = (
        db.query(Part)
        .options(joinedload(Part.pricing))
        .filter(Part.id == part_id)
        .first()
    )
    if not part:
        raise HTTPException(status_code=404, detail="Part not found")
    return _enrich(part)


# part creation
@router.post("/", response_model=PartOut)
def create_part(body: PartCreate, db: Session = Depends(get_db)):
    part = Part(
        name=body.name,
        brand=body.brand,
        category=body.category,
        specs=body.specs,
        image_url=body.image_url,
    )
    db.add(part)
    db.flush()
    pricing = Pricing(part_id=part.id, price=body.price, in_stock=body.in_stock)
    db.add(pricing)
    db.commit()
    db.refresh(part)
    return _enrich(part)

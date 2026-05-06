from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import Optional

from app.core.database import get_db
from app.models.part import Part, Pricing, PartCategory
from app.schemas.part import PartOut, PartCreate

# countiues filters when returning to parts
router = APIRouter(prefix="/parts", tags=["parts"])


def _enrich(part: Part) -> dict:
    compatibility = (
        "Available" if part.pricing and part.pricing.in_stock else "Out of Stock"
    )
    return {
        "id": part.id,
        "name": part.name,
        "brand": part.brand,
        "category": part.category,
        "specs": part.specs,
        "image_url": part.image_url,
        "price": part.pricing.price if part.pricing else None,
        "in_stock": part.pricing.in_stock if part.pricing else None,
        "compatibility": compatibility,
    }


# list part
def _filter_parts(
    parts: list[Part],
    min_price: Optional[float],
    max_price: Optional[float],
    in_stock_only: bool,
    spec_key: Optional[str] = None,
    spec_value: Optional[str] = None,
) -> list[dict]:
    results = []
    for p in parts:
        e = _enrich(p)
        if min_price is not None and e["price"] is not None and e["price"] < min_price:
            continue
        if max_price is not None and e["price"] is not None and e["price"] > max_price:
            continue
        if in_stock_only and not e.get("in_stock"):
            continue
        if spec_key and spec_value:
            spec_field = e.get("specs", {}).get(spec_key)
            if spec_field is None or spec_value.lower() not in str(spec_field).lower():
                continue
        results.append(e)
    return results


@router.get("/", response_model=list[PartOut])
def list_parts(
    category: Optional[PartCategory] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    brand: Optional[str] = None,
    in_stock_only: bool = False,
    spec_key: Optional[str] = None,
    spec_value: Optional[str] = None,
    sort: Optional[str] = None,
    db: Session = Depends(get_db),
):
    q = (
        db.query(Part)
        .options(joinedload(Part.pricing))
        .outerjoin(Pricing)
        .filter(Part.is_active)
    )
    if category:
        q = q.filter(Part.category == category)
    if brand:
        q = q.filter(Part.brand.ilike(f"%{brand}%"))

    if sort == "price_asc":
        q = q.order_by(Pricing.price.asc())
    elif sort == "price_desc":
        q = q.order_by(Pricing.price.desc())

    parts = q.all()
    return _filter_parts(parts, min_price, max_price, in_stock_only, spec_key, spec_value)


@router.get("/category/{category}", response_model=list[PartOut])
def list_parts_by_category(
    category: PartCategory,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    brand: Optional[str] = None,
    in_stock_only: bool = False,
    spec_key: Optional[str] = None,
    spec_value: Optional[str] = None,
    sort: Optional[str] = None,
    db: Session = Depends(get_db),
):
    q = (
        db.query(Part)
        .options(joinedload(Part.pricing))
        .outerjoin(Pricing)
        .filter(Part.is_active, Part.category == category)
    )
    if brand:
        q = q.filter(Part.brand.ilike(f"%{brand}%"))

    if sort == "price_asc":
        q = q.order_by(Pricing.price.asc())
    elif sort == "price_desc":
        q = q.order_by(Pricing.price.desc())

    parts = q.all()
    return _filter_parts(parts, min_price, max_price, in_stock_only, spec_key, spec_value)


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

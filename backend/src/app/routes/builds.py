from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import Optional

from app.core.database import get_db
from app.models.build import Build, BuildPart
from app.models.part import Part, Pricing, PartCategory
from app.models.user import User
from app.schemas.build import (
    BuildCreate,
    BuildOut,
    GeneratorRequest,
    CompatibilityCheckRequest,
)
from app.routes.auth import get_current_user

router = APIRouter(prefix="/builds", tags=["builds"])


# Weight Helpers

COMPATIBILITY_RULES = [
    (
        "cpu",
        "socket",
        "motherboard",
        "socket",
        "CPU socket must match motherboard socket",
    ),
    (
        "ram",
        "type",
        "motherboard",
        "supported_ram",
        "RAM type must be supported by motherboard",
    ),
]

# weight Distribution for different use cases
BUDGET_WEIGHTS = {
    "gaming": {
        "cpu": 0.22,
        "gpu": 0.38,
        "motherboard": 0.10,
        "ram": 0.08,
        "storage": 0.07,
        "psu": 0.07,
        "case": 0.06,
        "cooler": 0.02,
    },
    "workstation": {
        "cpu": 0.30,
        "gpu": 0.20,
        "motherboard": 0.12,
        "ram": 0.15,
        "storage": 0.10,
        "psu": 0.07,
        "case": 0.04,
        "cooler": 0.02,
    },
    "office": {
        "cpu": 0.25,
        "gpu": 0.10,
        "motherboard": 0.12,
        "ram": 0.12,
        "storage": 0.15,
        "psu": 0.10,
        "case": 0.10,
        "cooler": 0.06,
    },
    "budget": {
        "cpu": 0.22,
        "gpu": 0.30,
        "motherboard": 0.12,
        "ram": 0.10,
        "storage": 0.10,
        "psu": 0.08,
        "case": 0.05,
        "cooler": 0.03,
    },
}


def check_compatibility(parts: list[Part]) -> list[str]:
    by_cat = {p.category.value: p for p in parts}
    errors = []
    for cat_a, key_a, cat_b, key_b, msg in COMPATIBILITY_RULES:
        part_a = by_cat.get(cat_a)
        part_b = by_cat.get(cat_b)
        if not part_a or not part_b:
            continue
        specs_a = part_a.specs or {}
        specs_b = part_b.specs or {}
        val_a = specs_a.get(key_a)
        val_b = specs_b.get(key_b)
        if val_a and val_b and val_a != val_b:
            errors.append(f"{msg} (got {val_a} vs {val_b})")
    return errors


def _calc_total(build: Build) -> float:
    total = 0.0
    for bp in build.build_parts:
        if bp.part and bp.part.pricing:
            total += bp.part.pricing.price * bp.quantity
    return round(total, 2)


def _build_out(build: Build) -> dict:
    parts_out = []
    for bp in build.build_parts:
        price = bp.part.pricing.price if bp.part and bp.part.pricing else None
        parts_out.append(
            {
                "part_id": bp.part_id,
                "part_name": bp.part.name if bp.part else "?",
                "category": bp.part.category if bp.part else None,
                "quantity": bp.quantity,
                "unit_price": price,
                "subtotal": round(price * bp.quantity, 2) if price else None,
            }
        )
    return {
        "id": build.id,
        "name": build.name,
        "use_case": build.use_case,
        "budget": build.budget,
        "total_cost": _calc_total(build),
        "parts": parts_out,
        "created_at": build.created_at,
    }


def _load_build(build_id: int, db: Session) -> Build:
    build = (
        db.query(Build)
        .options(
            joinedload(Build.build_parts)
            .joinedload(BuildPart.part)
            .joinedload(Part.pricing)
        )
        .filter(Build.id == build_id)
        .first()
    )
    if not build:
        raise HTTPException(status_code=404, detail="Build not found")
    return build


# Endpoints


@router.get("/", response_model=list[BuildOut])
def list_builds(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    builds = (
        db.query(Build)
        .options(
            joinedload(Build.build_parts)
            .joinedload(BuildPart.part)
            .joinedload(Part.pricing)
        )
        .filter(Build.user_id == current_user.id)
        .all()
    )
    return [_build_out(b) for b in builds]


@router.get("/{build_id}", response_model=BuildOut)
def get_build(
    build_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    build = _load_build(build_id, db)
    if build.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this build")
    return _build_out(build)


@router.post("/", response_model=BuildOut)
def create_build(
    body: BuildCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
):
    """Manual parts selection flow."""
    parts = (
        db.query(Part)
        .options(joinedload(Part.pricing))
        .filter(Part.id.in_(body.part_ids))
        .all()
    )
    if len(parts) != len(body.part_ids):
        raise HTTPException(status_code=400, detail="One or more part IDs not found")

    errors = check_compatibility(parts)
    if errors:
        raise HTTPException(status_code=422, detail={"compatibility_errors": errors})

    build = Build(
        user_id=current_user.id if current_user else None,
        name=body.name,
        use_case=body.use_case,
        budget=body.budget,
        notes=body.notes,
    )
    db.add(build)
    db.flush()
    for part in parts:
        db.add(BuildPart(build_id=build.id, part_id=part.id, quantity=1))
    db.commit()
    return _build_out(_load_build(build.id, db))


@router.delete("/{build_id}", status_code=204)
def delete_build(
    build_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    build = (
        db.query(Build)
        .filter(Build.id == build_id, Build.user_id == current_user.id)
        .first()
    )
    if not build:
        raise HTTPException(status_code=404, detail="Build not found")
    db.delete(build)
    db.commit()


#


@router.post("/generate", response_model=BuildOut)
def generate_build(
    body: GeneratorRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
):
    """Guided generator flow — picks best parts within budget and use case."""
    weights = BUDGET_WEIGHTS.get(body.use_case.value, BUDGET_WEIGHTS["gaming"])
    selected_parts = []

    for category, weight in weights.items():
        target_price = body.budget * weight
        cat_enum = PartCategory(category)

        q = (
            db.query(Part)
            .join(Pricing)
            .filter(
                Part.category == cat_enum,
                Part.is_active,
                Pricing.in_stock,
            )
        )
        if body.preferred_brands:
            q = q.filter(Part.brand.in_(body.preferred_brands))

        candidates = (
            q.filter(Pricing.price <= target_price * 1.3)
            .order_by(Pricing.price.desc())
            .all()
        )
        if not candidates:
            candidates = q.order_by(Pricing.price.asc()).all()
        if candidates:
            selected_parts.append(candidates[0])

    if not selected_parts:
        raise HTTPException(
            status_code=400, detail="No parts found for this budget/use case"
        )

    build = Build(
        user_id=current_user.id if current_user else None,
        name=f"{body.use_case.value.title()} Build (${body.budget:.0f})",
        use_case=body.use_case,
        budget=body.budget,
    )
    db.add(build)
    db.flush()
    for part in selected_parts:
        db.add(BuildPart(build_id=build.id, part_id=part.id, quantity=1))
    db.commit()
    return _build_out(_load_build(build.id, db))


# compatibility check


@router.post("/compatibility-check")
def compatibility_check(body: CompatibilityCheckRequest, db: Session = Depends(get_db)):
    parts = db.query(Part).filter(Part.id.in_(body.part_ids)).all()
    errors = check_compatibility(parts)
    return {"compatible": len(errors) == 0, "errors": errors}

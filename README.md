# PC Builder

## Overview
PC Builder is a website that takes in a user's budget, preferences, and use case, and recommends the best possible PC components. The goal is to simplify the PC buying and building process, especially for beginners.

>MVP: A one-page website where an user can enter a budget and some basic preferences, and get one recommended, compatible PC build with a total price and per-part breakdown, plus a way to export it.

### Core Features
- Accepts user budget, use case, brand preferences, aesthetic preferences, and other details.
- Generates a recommended build.
- Displays total cost and per-part breakdown.
- Allow users to search for, filter by price and specs, swap parts, and update quantities.
- Allow users to export builds for later.

### Optional Upgrades
- Basic user registration/login, allowing users to view/edit/delete saved builds.
- Display the most popular parts from users.
- Compare two builds side-by-side.
- Live price tracking.
- Build templates.

### Teck Stack
| Layer | Technology |
|---|---|
| Frontend | React + Next.js |
| Design | ShadCN UI + Tailwind CSS |
| Backend | FastAPI + Pydantic |
| Database | SQLAlchemy |
| Server | Uvicorn |
| Authentication | Python-Jose + Passlib (JWT) |
| Middleware | CORS + Logging |
| Code Quality | Ruff + Pre-Commit |

## Setup Development Environment

List of virtual enviroment dependencies can be found in `pyproject.toml`.

### Prerequisites
- VS Code with an integrated PowerShell terminal.
- This repository cloned locally.
- Python installed matching `.python-version`.

### Setup Pre-Commit
```powershell
py -m pip install -U pip pre-commit

pre-commit install

pre-commit run --all-files

```

## Final Run Instructions

### Backend
```bash
DATABASE_URL="postgresql://postgres@localhost:5433/pcbuilder" PYTHONPATH=backend/src uv run uvicorn backend.main:app --reload
```

### Frontend
```bash
cd frontend
npm run dev -- --webpack
```

## Testing

### Backend Tests
```bash
DATABASE_URL="postgresql://postgres@localhost:5433/pcbuilder" PYTHONPATH=backend/src uv run pytest backend/tests --cov=backend/src/app --cov-report=term-missing
```

Verified result:
- `8` backend tests passed
- `76%` coverage

### Playwright Tests
```bash
cd frontend
npm run test:e2e
```

Verified result:
- `2` Playwright tests passed

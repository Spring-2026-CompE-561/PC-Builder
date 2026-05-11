# PC Builder

## Overview
PC Builder is a full-stack web application that helps users create custom PC builds based on budget, use case, and preferences. The goal is to simplify the PC building process, especially for beginners, while still supporting users who want more manual control.

### Core Features
- Guided build generation based on budget and use case
- Manual build creation from scratch
- Parts browsing by category
- Part detail pages
- User registration, login, logout, and delete account
- Saved builds list and build details view
- Export build data
- Delete saved builds
- About and Privacy pages

### Cybersecurity Features
- Login rate limiting after repeated failed attempts
- Password strength indicator during account creation
- JWT-based authentication for protected features

### Tech Stack
| Layer | Technology |
|---|---|
| Frontend | Next.js + React |
| UI | ShadCN UI + Tailwind CSS |
| Backend | FastAPI + UV |
| Database | PostgreSQL + SQLAlchemy |
| Authentication | Python-Jose + Passlib |
| Testing | Pytest, Pytest-Cov, Playwright |
| Code Quality | Ruff + Pre-Commit |

## Prerequisites
- Python 3.13
- Node.js and npm
- PostgreSQL
- uv

## Setup

```md
### 1. Clone the repository
```bash
git clone https://github.com/Spring-2026-CompE-561/PC-Builder.git
cd PC-Builder

### 2. Install backend dependencies
```bash
uv sync
```

### 3. Install frontend dependencies
```bash
cd frontend
npm install
cd ..
```

### 4. Create the PostgreSQL database
Make sure PostgreSQL is running, then create a database named `pcbuilder`.

Example:
```bash
createdb pcbuilder
```

### 5. Create a `.env` file in the project root
Add your local PostgreSQL connection string:

```env
DATABASE_URL=postgresql://YOUR_POSTGRES_USER:YOUR_POSTGRES_PASSWORD@localhost:5432/pcbuilder
```

If your PostgreSQL setup does not use a password, you can use:

```env
DATABASE_URL=postgresql://YOUR_POSTGRES_USER@localhost:5432/pcbuilder
```

### 6. Seed the sample parts data
```bash
uv run python backend/src/seed.py
```

## Run the Project

### Backend
Run from the project root:

```bash
PYTHONPATH=backend/src uv run uvicorn backend.main:app --reload
```

### Frontend
Run from the `frontend` folder:

```bash
cd frontend
npm run dev -- --webpack
```

Then open:
- `http://localhost:3000`

Note:
- The frontend already falls back to `http://localhost:8000` for API calls, so no frontend env file is required for local use.

## Main Functionalities
- User registration, login, logout, and delete account
- Guided build generation from the home page
- Manual build creation from scratch
- Parts browsing and part details
- Saved builds list and build details page
- Export build data
- Delete saved builds
- About and Privacy pages

## Testing

### Backend Unit Tests
Run from the project root:

```bash
PYTHONPATH=backend/src uv run pytest backend/tests --cov=backend/src/app --cov-report=term-missing
```

Verified result:
- `8` backend tests passed
- `76%` backend coverage

### Frontend/Backend Integration Tests
Run from the `frontend` folder:

```bash
npx playwright install
npm run test:e2e
```

Verified result:
- `2` Playwright tests passed

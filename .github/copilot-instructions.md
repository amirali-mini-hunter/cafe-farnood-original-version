# Copilot instructions — cafe-farnood-original-version

This file gives concise, action-oriented guidance for automated coding agents working on this repository (a small Flask API + Vite/React frontend).

Goals for an agent working here
- Make small, safe changes that keep both backend and frontend runnable locally.
- Prefer non-invasive fixes: README/docs, tests, small bug fixes, and low-risk refactors.
- When adding features that touch both backend and frontend, update run instructions and add a minimal smoke test.

Quick architecture summary
- Backend: `app.py` — Flask application providing a simple Product model backed by SQLAlchemy and an SQLite DB (`instance/cafe_farnood.db`). Main API endpoints live under `/api/*` (GET/POST/PUT/DELETE for `/api/products`). The Flask app creates the DB on startup when run directly.
- Frontend: Vite + React. `package.json` defines `dev`, `build`, and `preview`. Frontend source lives in the repository root (`App.tsx`, `index.tsx`) and static pages like `admin.html` and `dashboard.html` exist for simple admin flows.
- Data flow: Frontend fetches from the backend API (localhost:5000) — see `App.tsx` and `admin.html` for examples of fetch calls to `/api/products`.

Developer workflows (what the agent needs to know)
- Start backend (development):
  - Create and activate a Python venv, install requirements, then run `python app.py` which will create the SQLite DB and start Flask on port 5000.
  - Example (developer/local):
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    python app.py
    ```
- Start frontend (development):
  - Install node deps and run Vite dev server on port 5173.
    ```bash
    npm install
    npm run dev
    ```
- Database: default is SQLite at `sqlite:///cafe_farnood.db`. To switch to MySQL, the project uses SQLAlchemy DSN patterns (see `README.md` for the example). Do not modify the DB engine unless tests or a migration are provided.
- Ports: frontend 5173, backend 5000. The backend code already attempts to be permissive with CORS for Vite origins; preserve or extend CORS rules only when necessary and safe.

Project-specific conventions and patterns
- Simple single-file backend: `app.py` contains model, routes, and app setup. Keep small backend edits minimal and prefer adding testable helper functions rather than large restructures.
- CORS handling: `app.py` contains both a `CORS(...)` call and explicit header-setting in `after_request` and in OPTIONS handlers (used for Vite preflight). When touching CORS or request handling, update all related places.
- HTML admin pages: `admin.html` and `dashboard.html` are static pages that call the same API; they are useful for manual smoke tests and examples.
- Frontend structure: React files are at the repository root and `components/`; follow existing TSX patterns and types in `types.ts` when editing components.

Integration points and external dependencies
- Python: Flask, Flask-SQLAlchemy, Flask-CORS. See `requirements.txt` for pinned versions.
- Node: Vite, React. See `package.json` for scripts.
- Database: SQLite by default. A MySQL driver (`PyMySQL`) is listed in `requirements.txt` but not configured by default.

Safe edit checklist for agents
- Run unit/smoke checks manually where possible (start backend and hit `/api/products`).
- When editing backend CORS or routes, test with `curl` or the provided `admin.html` to ensure requests succeed.
- Avoid large refactors that split `app.py` across multiple files unless accompanied by tests and clear run instructions.

Concrete examples to reference in changes
- Fetch example: check `App.tsx` for how the frontend calls `GET /api/products` and expects a JSON list of product objects.
- DB creation: `if __name__ == '__main__': ... db.create_all()` — creating the DB is done on app start.
- Vite scripts: `package.json` — `npm run dev` runs `vite` on port 5173.

When to ask for human review
- Any change that migrates the DB or alters the schema.
- Adding authentication, secrets, or external integrations (email, payment gateways).
- Large frontend-backend API contract changes (change shape of `/api/products` responses).

What not to do
- Don't alter production configuration or secrets (none present in repo). Don't assume production deployment details.
- Don't replace SQLite with a different engine silently.

Where to look next (key files)
- `app.py` — backend implementation and CORS handling
- `requirements.txt` — Python dependencies
- `package.json`, `vite.config.ts` — frontend scripts and build
- `App.tsx`, `index.tsx`, `components/` — frontend code
- `admin.html`, `dashboard.html` — static admin/demo pages

If parts of the repo are unclear, ask the maintainer for:
- Intended deployment environment (how they run Flask in production)
- Any missing test commands or CI steps

If you edit this file, preserve the short, example-driven style and the local run commands.

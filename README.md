# TruthLayer

A **credibility-focused social feed** where posts can be analyzed for trust signals: AI labels, community star ratings, expert input, comments, and moderation workflows.

## Repo layout

| Path | Purpose |
|------|--------|
| **`frontend/`** | React (Vite) SPA: UI, routing, Base44 client |
| **`backend/entities/`** | JSON schemas for Base44 entities (posts, ratings, etc.) |

## Stack

- **React** (Vite) · **React Router** · **Tailwind CSS** · **Radix / shadcn-style UI**
- **Base44** (`@base44/sdk`) for auth, entities, and app config

## Scripts (from repo root)

```bash
cd frontend && npm install   # first time, or after dependency changes
npm run dev --prefix frontend    # or: cd frontend && npm run dev
npm run build --prefix frontend
```

Configure **`frontend/.env`** (see `frontend/.env.example`): `VITE_BASE44_APP_ID`, optional `VITE_BASE44_APP_BASE_URL`.

## License

Private / as configured by the repository owner.

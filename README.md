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
npm install --prefix frontend   # first time, or after dependency changes
npm run dev                     # runs Vite inside frontend/
npm run build
```

Configure **`frontend/.env`** (see `frontend/.env.example`): `VITE_BASE44_APP_ID`, optional `VITE_BASE44_APP_BASE_URL`.

## Troubleshooting

- **404 on `http://localhost:5173`:** Usually an **old** Vite/Node process is still bound to 5173 from before the app lived in `frontend/`. Stop all dev servers (Ctrl+C), then run `npm run dev` from the **repo root** and open the **URL Vite prints** (if 5173 is busy, it will be 5174, 5175, …).

## License

Private / as configured by the repository owner.

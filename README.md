# Personal Diary (Next.js + Go)

Monorepo personal diary sesuai workflow: auth JWT, CRUD diary entries, dan dashboard frontend.

## Struktur

- `/backend` Go API (Chi + GORM + PostgreSQL + JWT)
- `/frontend` Next.js App Router (TypeScript + Tailwind + TanStack Query)

## 1) Jalankan backend

```bash
cd backend
cp .env.example .env
go mod tidy
go run ./cmd/api
```

Backend default: `http://localhost:8080`

## 2) Jalankan frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Frontend default: `http://localhost:3000`

## API Endpoint

- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `GET /api/v1/entries` (auth)
- `POST /api/v1/entries` (auth)
- `GET /api/v1/entries/:id` (auth)
- `PUT /api/v1/entries/:id` (auth)
- `DELETE /api/v1/entries/:id` (auth)

## Deploy Notes

- Backend: gunakan `backend/Dockerfile` untuk deploy ke Render/Railway.
- Frontend: deploy `frontend` ke Vercel.
- Pastikan variabel env produksi sudah terisi:
  - Backend: `DB_DSN`, `JWT_SECRET`, `CORS_ALLOWED_ORIGIN`
  - Frontend: `NEXT_PUBLIC_API_URL`

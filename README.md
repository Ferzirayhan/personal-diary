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

### Railway (Backend) + Vercel (Frontend)

1. Push repo ke GitHub.
2. Di Railway, `New Project` -> `Deploy from GitHub repo`.
3. Saat membuat service backend, set **Root Directory** ke `backend` agar Railway pakai `backend/Dockerfile`.
4. Tambahkan PostgreSQL di Railway (`New` -> `Database` -> `PostgreSQL`).
5. Set environment variables backend di Railway:
   - `DATABASE_URL` (otomatis dari Railway Postgres) atau `DB_DSN`
   - `JWT_SECRET` (string random panjang)
   - `CORS_ALLOWED_ORIGIN=https://<your-vercel-domain>`
   - `APP_ENV=production`
   - `JWT_EXPIRES_IN_HOURS=24`
   - `PORT` akan diisi Railway otomatis (backend juga support `APP_PORT`).
6. Deploy service backend dan copy URL Railway, contoh: `https://your-api.up.railway.app`
7. Di Vercel (frontend), set:
   - `NEXT_PUBLIC_API_URL=https://your-api.up.railway.app/api/v1`
8. Redeploy frontend di Vercel.

---

## 🎨 Cara Mengubah Logo & Tulisan

### 1. Mengubah Logo (Judul Aplikasi)
Buka file `frontend/components/app-shell.tsx`.
Cari tulisan `"My Diary"` dan ubah sesuai keinginanmu (ada di 2 tempat: tampilan Desktop & Mobile).

### 2. Mengubah Judul Tab Browser
Buka file `frontend/app/layout.tsx`.
Ubah bagian `title` dan `description` di dalam `metadata`.

### 3. Mengubah Tulisan di Halaman
- **Dashboard (List Entry):** `frontend/components/entry-list.tsx`
- **Halaman Login/Register:** `frontend/app/(auth)/login/page.tsx` & `register/page.tsx`
- **Form Entry Baru:** `frontend/components/entry-form.tsx`

# Buku Tutorial Personal Diary

Panduan ini dibuat buat kamu yang mau:
- Ganti nama aplikasi, judul, dan teks.
- Belajar backend (Go + PostgreSQL) dari nol sampai paham alurnya.
- Belajar frontend (Next.js + Tailwind) dan ngotak-ngatik tampilannya.

---

## Daftar Isi
1. Gambaran Proyek
2. Menjalankan Project
3. Cara Ganti Nama Aplikasi dan Teks
4. Dasar Backend (Go + PostgreSQL)
5. Dasar Frontend (Next.js + Tailwind)
6. Cara Ngotak-ngatik Frontend
7. Alur Kerja Aman Saat Edit Kode
8. Checklist Belajar Biar Cepat Naik Level

---

## 1) Gambaran Proyek

Project ini monorepo:
- `backend/`: API server Go (Chi + GORM + JWT + PostgreSQL)
- `frontend/`: Next.js App Router + TypeScript + Tailwind

Alur data sederhananya:
1. Frontend kirim request ke API backend.
2. Backend validasi token JWT.
3. Backend baca/tulis data ke PostgreSQL.
4. Backend kirim response JSON ke frontend.
5. Frontend render ulang UI.

---

## 2) Menjalankan Project

### Jalankan backend
```bash
cd backend
cp .env.example .env
go mod tidy
go run ./cmd/api
```
Backend aktif di: `http://localhost:8080`

### Jalankan frontend
```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```
Frontend aktif di: `http://localhost:3000`

---

## 3) Cara Ganti Nama Aplikasi dan Teks

### A. Ganti logo/judul aplikasi di sidebar/topbar
File: `frontend/components/app-shell.tsx`
- Cari teks: `"My Diary"`
- Ubah jadi nama yang kamu mau.

### B. Ganti judul tab browser
File: `frontend/app/layout.tsx`
- Ubah nilai `title` dan `description` di object `metadata`.

Contoh:
```ts
export const metadata = {
  title: 'Catatan Harian Ezi',
  description: 'Aplikasi diary pribadi'
}
```

### C. Ganti teks halaman login/register
- `frontend/app/(auth)/login/page.tsx`
- `frontend/app/(auth)/register/page.tsx`

### D. Ganti teks dashboard/list diary
- `frontend/components/entry-list.tsx`

### E. Ganti teks form tambah/edit diary
- `frontend/components/entry-form.tsx`

---

## 4) Dasar Backend (Go + PostgreSQL)

## Konsep inti backend kamu
- Router: atur endpoint URL (`/api/v1/...`)
- Handler/Controller: terima request, validasi, proses
- Service (kalau ada): logika bisnis
- Repository/Model: akses database
- Middleware: cek auth JWT, logging, CORS

## Endpoint penting
- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `GET /api/v1/entries` (butuh token)
- `POST /api/v1/entries` (butuh token)
- `GET /api/v1/entries/:id` (butuh token)
- `PUT /api/v1/entries/:id` (butuh token)
- `DELETE /api/v1/entries/:id` (butuh token)

## Dasar PostgreSQL yang wajib paham

### A. Cek list tabel
```sql
\dt
```

### B. Lihat isi tabel
```sql
SELECT * FROM users;
SELECT * FROM entries;
```

### C. Insert data manual
```sql
INSERT INTO entries (id, user_id, title, content, created_at, updated_at)
VALUES ('uuid-kamu', 'user-uuid', 'Judul contoh', 'Isi diary', NOW(), NOW());
```

### D. Update data
```sql
UPDATE entries
SET title = 'Judul baru', updated_at = NOW()
WHERE id = 'entry-uuid';
```

### E. Hapus data
```sql
DELETE FROM entries WHERE id = 'entry-uuid';
```

## Tips aman backend
- Jangan hardcode `JWT_SECRET` di source code.
- Simpan config di `.env`.
- Selalu validasi input (title/content jangan kosong).
- Tangani error DB dengan response yang jelas.

---

## 5) Dasar Frontend (Next.js + Tailwind)

## Konsep inti frontend kamu
- `app/`: routing halaman (App Router)
- `components/`: komponen UI reusable
- `hooks/`: custom hook
- `lib/`: helper, API client, util
- `providers/`: context/query provider
- `styles/`: style global

## Alur umum data di frontend
1. User klik tombol / submit form.
2. Function panggil API backend.
3. Kalau sukses: update state/cache lalu render ulang.
4. Kalau gagal: tampilkan error message.

## Tailwind basic yang sering dipakai
- Spacing: `p-4`, `m-2`, `gap-3`
- Typography: `text-sm`, `font-semibold`
- Warna: `bg-slate-900`, `text-white`
- Radius & shadow: `rounded-xl`, `shadow-md`
- Layout: `flex`, `grid`, `items-center`, `justify-between`

---

## 6) Cara Ngotak-ngatik Frontend

## A. Ubah warna tema cepat
1. Buka: `frontend/tailwind.config.ts`
2. Cari bagian `theme.extend.colors`
3. Ganti palet warna.

Contoh konsep warna:
- Primer: biru tua
- Aksen: hijau mint
- Netral: abu lembut

## B. Ubah style komponen
Contoh target file:
- `frontend/components/app-shell.tsx`
- `frontend/components/entry-list.tsx`
- `frontend/components/entry-form.tsx`

Yang biasa kamu ubah:
- ukuran (`text-lg`, `p-4`)
- warna (`bg-*`, `text-*`)
- border (`border`, `rounded-*`)
- hover (`hover:bg-*`, `transition`)

## C. Tambah section baru di dashboard
Langkah:
1. Buat komponen baru di `frontend/components/`.
2. Import komponen itu ke halaman dashboard (di folder `frontend/app/...`).
3. Isi data dummy dulu.
4. Sambungkan ke API kalau UI sudah oke.

## D. Cara debugging cepat frontend
- Gunakan browser devtools (`Inspect`).
- Cek tab `Console` buat error.
- Cek tab `Network` buat lihat request API berhasil/gagal.
- Jika error fetch, cek `NEXT_PUBLIC_API_URL` di `.env.local`.

---

## 7) Alur Kerja Aman Saat Edit Kode

1. Jalankan project backend + frontend dulu.
2. Ubah satu hal kecil.
3. Cek hasil di browser.
4. Kalau aman, lanjut perubahan berikutnya.
5. Commit bertahap (jangan semua jadi satu commit besar).

Contoh pesan commit rapi:
- `feat(frontend): rename app branding to Catatan Harian Ezi`
- `style(frontend): update dashboard card spacing`
- `fix(backend): validate empty entry title`

---

## 8) Checklist Belajar Biar Cepat Naik Level

## Minggu 1
- Paham struktur folder backend/frontend
- Bisa jalanin project lokal
- Bisa ganti branding dan teks aplikasi

## Minggu 2
- Paham endpoint auth + entries
- Bisa test API pakai Postman/Insomnia
- Bisa query dasar PostgreSQL (SELECT/INSERT/UPDATE/DELETE)

## Minggu 3
- Bisa modif komponen frontend tanpa ngerusak flow
- Paham state loading/error/success
- Bisa sinkron UI dengan data backend

## Minggu 4
- Tambah 1 fitur kecil end-to-end (backend + frontend)
- Contoh: filter entries by date, search keyword, atau kategori mood

---

## Penutup
Kalau kamu bingung saat edit:
- Mulai dari perubahan kecil dulu.
- Pastikan backend jalan sebelum nyalahin frontend.
- Cek response API dulu sebelum styling UI.

Belajar fullstack paling cepat: sering praktik, sering pecah masalah jadi kecil, lalu beresin satu-satu.

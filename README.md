# Aplikasi Pengadaan PPK dan PBJ

Aplikasi web statis untuk administrasi pengadaan satuan kerja, khususnya monitoring PPK dan PBJ. Aplikasi ini menjadi front-end pendamping Google Sheet, Google Drive, dan Google Apps Script untuk mencatat paket, melihat pagu dan realisasi, memantau dokumen, membuat checklist administrasi, menyiapkan laporan paket, serta mengelola register nomor.

## Stack

- React, Vite, TypeScript
- Tailwind CSS
- Recharts untuk grafik dashboard
- LocalStorage untuk cache dan draft lokal
- Google Apps Script Web App sebagai jembatan ke Google Sheet dan Google Drive

Tidak ada backend server tambahan, database eksternal, API berbayar, atau secret di frontend.

## Data Awal

Seed data dibuat dari workbook `Aplikasi_Pengadaan_PPK_PBJ_Terintegrasi_POK_Realisasi_Juni_2026.xlsx`.

Ringkasan awal:

- Satker: KPPBC TMP C Pangkalpinang
- Kode satker: 636722
- Tahun Anggaran: 2026
- Alokasi POK/DIPA: Rp2.838.552.000
- Total realisasi s.d. Juni: Rp1.127.301.655
- Sisa anggaran: Rp1.711.250.345
- Total nilai PBJ awal: Rp296.860.691
- Jumlah paket awal: 18 paket
- Jumlah penyedia awal: 10 penyedia

Sheet sumber yang dipakai sebagai seed:

- `DATA_PAKET`
- `DATA_PENYEDIA`
- `DATA_DOKUMEN`
- `CHECKLIST_ADMINISTRASI`
- `DATA_ANGGARAN`
- `POK_DETAIL`
- `NOMOR_REGISTER`
- `ARSIP`

## Cara Install

```bash
npm install
```

## Menjalankan Lokal

```bash
npm run dev
```

Buka URL lokal yang muncul dari Vite, biasanya `http://localhost:5173`.

## Build

```bash
npm run build
```

Output produksi ada di folder `dist`.

## Lint

```bash
npm run lint
```

## Koneksi Google Apps Script

1. Buat Google Sheet baru.
2. Impor workbook sumber ke Google Sheet:
   - File > Import
   - Upload `Aplikasi_Pengadaan_PPK_PBJ_Terintegrasi_POK_Realisasi_Juni_2026.xlsx`
   - Pilih ganti spreadsheet atau masukkan sheet sesuai kebutuhan.
3. Buka Extensions > Apps Script.
4. Salin file dari folder `apps-script/apps_script_pengadaan_ppk_pbj_terintegrasi` ke project Apps Script:
   - `Code.gs`
   - `Config.gs`
   - `SheetService.gs`
   - `PackageService.gs`
   - `BudgetService.gs`
   - `DocumentService.gs`
   - `ChecklistService.gs`
   - `DriveService.gs`
   - file service lain yang tersedia
   - file `.html` untuk sidebar/form jika diperlukan.
5. Isi `ROOT_FOLDER_ID` di `Config.gs` dengan ID folder Google Drive root.
6. Deploy > New deployment > Web app.
7. Set akses sesuai kebijakan internal, lalu salin Web App URL.
8. Buka menu Pengaturan di aplikasi web.
9. Tempel Web App URL dan Root Folder ID, lalu simpan.

Catatan: MVP tidak menyimpan token atau secret. Upload file langsung dari frontend belum diaktifkan. Link dokumen Drive ditempel melalui Google Sheet atau endpoint Apps Script.

## Deploy ke Vercel

### Via GitHub Import

1. Push repo ke `https://github.com/webbcpapin/pengadaan`.
2. Login ke Vercel.
3. Import GitHub repo `webbcpapin/pengadaan`.
4. Framework preset: Vite.
5. Build command: `npm run build`.
6. Output directory: `dist`.
7. Deploy.

### Via Vercel CLI

```bash
npm install
npm run build
npx vercel --prod
```

## Menu

- Dashboard
- Paket Pengadaan
- Anggaran dan Realisasi
- POK Detail
- Penyedia
- Dokumen
- Checklist Administrasi
- Laporan Paket
- Tata Naskah dan Nomor
- Arsip Drive
- Pengaturan

## Perilaku Draft Lokal

Form Tambah Paket akan:

- Validasi nama paket, metode, akun, nilai pagu, nilai kontrak, dan tanggal.
- Generate ID paket.
- Generate kode paket `PBJ-2026-[AKUN]-[URUT 3 DIGIT]`.
- Mengirim data ke Apps Script jika Web App URL sudah diatur.
- Menyimpan ke `localStorage` sebagai `Draft Lokal` jika endpoint belum ada atau gagal.

## Roadmap

### Versi 2

- Sinkronisasi dua arah dengan Google Sheet.
- Pembuatan folder Drive paket dari Apps Script.
- Update link dokumen per baris.
- Generator dokumen dari template Google Docs.
- Audit log perubahan paket.

### Versi 3

- Role sederhana berbasis akun Google melalui Apps Script.
- Validasi dokumen per tahap.
- Notifikasi deadline administrasi.
- Export laporan paket ke PDF.
- Dashboard kinerja pengadaan lintas periode.

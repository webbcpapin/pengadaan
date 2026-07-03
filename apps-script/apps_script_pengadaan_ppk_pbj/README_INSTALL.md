# Instalasi Aplikasi Pengadaan PPK dan PBJ

Versi ini sudah diisi data awal dari POK/DIPA, Realisasi s.d. Juni 2026, dan daftar Pengadaan Barang dan Jasa.

## Cara memasang

1. Upload file workbook `Aplikasi_Pengadaan_PPK_PBJ_Terintegrasi_POK_Realisasi_Juni_2026.xlsx` ke Google Drive.
2. Buka dengan Google Sheets.
3. Buat folder induk di Google Drive, misalnya `Aplikasi Pengadaan PPK PBJ 2026`.
4. Salin Folder ID dari URL folder tersebut.
5. Buka menu Extensions > Apps Script.
6. Buat file sesuai isi ZIP ini.
7. Tempel isi setiap file `.gs` dan `.html`.
8. Buka `Config.gs`.
9. Ganti `ROOT_FOLDER_ID` dengan Folder ID Google Drive.
10. Simpan project Apps Script.
11. Jalankan fungsi `onOpen` sekali untuk otorisasi.
12. Reload Google Sheet.
13. Buka menu `Aplikasi Pengadaan`.

## Menu utama

- Tambah Paket Baru
- Buat Folder Paket
- Update Checklist Dokumen
- Generate Dashboard
- Sinkron Anggaran PBJ
- Cek Sisa Anggaran
- Cek Dokumen Belum Lengkap
- Buat Laporan Paket
- Refresh Data
- Pengaturan

## Data yang sudah diimplementasikan

- DATA_PAKET berisi 18 paket PBJ aktual dari file upload.
- DATA_PENYEDIA berisi 10 penyedia unik.
- DATA_ANGGARAN berisi 58 mata anggaran hasil agregasi POK/DIPA dan realisasi.
- POK_DETAIL berisi 137 detail mata anggaran.
- DATA_DOKUMEN berisi checklist dokumen awal per paket.
- CHECKLIST_ADMINISTRASI berisi checklist otomatis per paket.
- NOMOR_REGISTER sudah di-seed per akun agar nomor PBJ berikutnya tidak dobel.

## Hal yang perlu dilengkapi manual

- NPWP, NIB, alamat, nomor rekening penyedia.
- HPS, nomor SPK/surat pesanan, nomor BAST/BAPP.
- Link folder dan link file dokumen setelah folder Drive dibuat.
- Format nomor final sesuai tata naskah internal.
- Kode klasifikasi arsip dan retensi final.

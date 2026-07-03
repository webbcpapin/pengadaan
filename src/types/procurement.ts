export type StatusTone = "green" | "yellow" | "red" | "gray" | "blue";

export interface SeedMeta {
  appName: string;
  satker: string;
  kodeSatker: string;
  tahunAnggaran: number;
  alokasiDipa: number;
  totalRealisasiJuni: number;
  sisaAnggaran: number;
  totalNilaiPbj: number;
  jumlahPaket: number;
  jumlahPenyedia: number;
  sourceWorkbook: string;
}

export interface PackageItem {
  "ID Paket": string;
  "Kode Paket": string;
  "Tahun Anggaran": number;
  "Nama Paket": string;
  "Unit/Seksi Pemohon": string;
  "Jenis Belanja": string;
  "Akun Belanja": string;
  "Metode Pengadaan": string;
  "Jenis Kontrak": string;
  "Pagu Anggaran": number;
  "Nilai HPS": number | null;
  "Nilai Kontrak/SPK": number;
  "Nama Penyedia": string;
  "Tanggal Mulai": string | null;
  "Tanggal Selesai": string | null;
  "Status Pengadaan": string;
  "Status Dokumen": string;
  "Status Pembayaran": string;
  "Link Folder Drive": string | null;
  PIC: string;
  Catatan: string | null;
  "Risiko Administrasi": string;
  "Perlu Tindak Lanjut": string;
}

export interface ProviderItem {
  "ID Penyedia": string;
  "Nama Penyedia": string;
  "Bentuk Usaha": string;
  NPWP: string | null;
  NIB: string | null;
  Alamat: string | null;
  "Nama PIC": string | null;
  "Nomor HP": string | null;
  Email: string | null;
  "Nomor Rekening": string | null;
  "Nama Bank": string | null;
  "Status PKP": string;
  Catatan: string | null;
}

export interface DocumentItem {
  "ID Dokumen": string;
  "ID Paket": string;
  "Nama Paket": string;
  "Tahap Dokumen": string;
  "Nama Dokumen": string;
  "Wajib/Tidak": string;
  "Status Dokumen": string;
  "Tanggal Upload": string | null;
  "Link File": string | null;
  Catatan: string | null;
  "Perlu Revisi": string;
  "Updated At": string | number | null;
}

export interface BudgetItem {
  "Tahun Anggaran": number;
  "Kode Akun": string;
  "Uraian Akun": string;
  "Pagu Akhir": number;
  "Total Realisasi": number;
  "Sisa Anggaran": number;
  "Total Paket PBJ": number;
  "% Realisasi": number;
  "Status Anggaran": string;
}

export interface PokDetailItem {
  No: number;
  "Mata Anggaran": string;
  "Kode Akun": number;
  "Uraian Akun": string;
  "Nama Detail Sumber": string;
  "Uraian Detail": string;
  Volume: number | null;
  Satuan: string | null;
  "Harga Satuan": number | null;
  "Pagu 2026": number;
  "Realisasi s.d. Juni 2026": number;
  Sisa: number;
}

export type ChecklistItem = Record<string, string | number | null>;
export type RegisterItem = Record<string, string | number | null>;
export type ArchiveItem = Record<string, string | number | null>;

export interface Settings {
  appsScriptUrl: string;
  rootFolderId: string;
  kodeSatker: string;
  namaSatker: string;
  tahunAnggaran: string;
  kodeUnit: string;
  namaPpk: string;
  nipPpk: string;
  namaKpa: string;
  nipKpa: string;
  namaPbj: string;
  nipPbj: string;
}

export interface AppSeed {
  META: SeedMeta;
  DATA_PAKET: PackageItem[];
  DATA_PENYEDIA: ProviderItem[];
  DATA_DOKUMEN: DocumentItem[];
  CHECKLIST_ADMINISTRASI: ChecklistItem[];
  DATA_ANGGARAN: BudgetItem[];
  POK_DETAIL: PokDetailItem[];
  NOMOR_REGISTER: RegisterItem[];
  ARSIP: ArchiveItem[];
}

export type PackageDraft = Omit<PackageItem, "ID Paket" | "Kode Paket" | "Status Pengadaan" | "Status Dokumen" | "Status Pembayaran" | "Risiko Administrasi" | "Perlu Tindak Lanjut"> & {
  Catatan: string;
};

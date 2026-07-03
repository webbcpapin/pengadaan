import { DataTable } from "../components/DataTable";
import { SectionHeader } from "../components/SectionHeader";
import type { ArchiveItem } from "../types/procurement";

const subfolders = [
  "01_Perencanaan",
  "02_Persiapan_Pengadaan",
  "03_Kontrak_SPK",
  "04_Pelaksanaan",
  "05_Serah_Terima",
  "06_Pembayaran",
  "07_Pajak",
  "08_Laporan",
  "09_Dokumentasi",
  "10_Korespondensi",
];

export function ArchivePage({ rows }: { rows: ArchiveItem[] }) {
  return (
    <>
      <SectionHeader title="Arsip Drive" subtitle="Metadata folder paket dan struktur subfolder Google Drive." />
      <div className="mb-5 rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Upload langsung dari frontend belum diaktifkan pada MVP. Simpan dokumen di Drive, lalu tempel link file melalui Google Sheet atau Apps Script Web App pada versi berikutnya.
      </div>
      <div className="mb-5 flex flex-wrap gap-2">
        {subfolders.map((folder) => <span key={folder} className="rounded border border-line bg-white px-3 py-2 text-sm font-medium text-slate-700">{folder}</span>)}
      </div>
      <DataTable
        rows={rows}
        columns={[
          { key: "id", header: "Archive ID", render: (row) => String(row["Archive ID"] ?? "") },
          { key: "kode", header: "Kode paket", render: (row) => String(row["Kode Paket"] ?? "") },
          { key: "nama", header: "Nama paket", render: (row) => String(row["Nama Paket"] ?? ""), className: "min-w-72" },
          { key: "klas", header: "Kode klasifikasi", render: (row) => String(row["Kode Klasifikasi"] ?? "") },
          { key: "keamanan", header: "Keamanan", render: (row) => String(row["Tingkat Keamanan"] ?? "") },
          { key: "akses", header: "Akses", render: (row) => String(row["Tingkat Akses"] ?? "") },
          { key: "retensi", header: "Retensi", render: (row) => `${row["Retensi Aktif"] ?? "-"} / ${row["Retensi Inaktif"] ?? "-"}` },
          { key: "status", header: "Status arsip", render: (row) => String(row["Status Arsip"] ?? "") },
          { key: "folder", header: "Folder Drive", render: (row) => String(row["Folder Drive"] ?? "Belum ada") },
        ]}
      />
    </>
  );
}

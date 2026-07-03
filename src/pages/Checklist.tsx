import { DataTable } from "../components/DataTable";
import { SectionHeader } from "../components/SectionHeader";
import type { ChecklistItem } from "../types/procurement";
import { Badge } from "../components/Badge";

const docs = [
  "KAK/TOR",
  "RAB",
  "HPS",
  "Survey Harga",
  "Nota Dinas Kebutuhan",
  "Undangan Penawaran",
  "Penawaran Penyedia",
  "Evaluasi/Klarifikasi",
  "Negosiasi",
  "Penetapan Penyedia",
  "SPK/Kontrak/Surat Pesanan",
  "BAST",
  "Invoice/Tagihan",
  "Kuitansi",
  "Laporan Pelaksanaan",
];

export function ChecklistPage({ rows }: { rows: ChecklistItem[] }) {
  return (
    <>
      <SectionHeader title="Checklist Administrasi" subtitle="Checklist dokumen wajib per paket." />
      <DataTable
        rows={rows}
        columns={[
          { key: "id", header: "ID paket", render: (row) => String(row["ID Paket"] ?? "") },
          { key: "nama", header: "Nama paket", render: (row) => String(row["Nama Paket"] ?? ""), className: "min-w-72" },
          ...docs.map((name) => ({ key: name, header: name, render: (row: ChecklistItem) => <Badge value={String(row[name] ?? "-")} /> })),
          { key: "status", header: "Status lengkap", render: (row) => <Badge value={String(row["Status Lengkap"] ?? "-")} /> },
          { key: "catatan", header: "Catatan", render: (row) => String(row.Catatan ?? "-"), className: "min-w-72" },
        ]}
      />
    </>
  );
}

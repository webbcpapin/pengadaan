import { useMemo, useState } from "react";
import { Badge } from "../components/Badge";
import { DataTable } from "../components/DataTable";
import { SectionHeader } from "../components/SectionHeader";
import type { DocumentItem } from "../types/procurement";

export function DocumentsPage({ rows }: { rows: DocumentItem[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => rows.filter((row) => `${row["ID Paket"]} ${row["Nama Paket"]} ${row["Nama Dokumen"]}`.toLowerCase().includes(query.toLowerCase())), [query, rows]);

  return (
    <>
      <SectionHeader title="Dokumen" subtitle={`${filtered.length} dokumen administrasi`} />
      <input className="mb-4 w-full rounded border border-line bg-white px-3 py-2 md:w-96" placeholder="Cari paket atau dokumen" value={query} onChange={(event) => setQuery(event.target.value)} />
      <DataTable
        rows={filtered}
        columns={[
          { key: "id", header: "ID dokumen", render: (row) => row["ID Dokumen"] },
          { key: "paket", header: "ID paket", render: (row) => row["ID Paket"] },
          { key: "nama", header: "Nama paket", render: (row) => row["Nama Paket"], className: "min-w-64" },
          { key: "tahap", header: "Tahap dokumen", render: (row) => row["Tahap Dokumen"] },
          { key: "dok", header: "Nama dokumen", render: (row) => row["Nama Dokumen"] },
          { key: "wajib", header: "Wajib", render: (row) => row["Wajib/Tidak"] },
          { key: "status", header: "Status", render: (row) => <Badge value={row["Status Dokumen"]} /> },
          { key: "tanggal", header: "Tanggal upload", render: (row) => row["Tanggal Upload"] ?? "-" },
          { key: "link", header: "Link file", render: (row) => row["Link File"] ? <a className="text-brand underline" href={row["Link File"]}>Buka</a> : "-" },
          { key: "revisi", header: "Perlu revisi", render: (row) => <Badge value={row["Perlu Revisi"]} /> },
          { key: "catatan", header: "Catatan", render: (row) => row.Catatan ?? "-", className: "min-w-64" },
        ]}
      />
    </>
  );
}

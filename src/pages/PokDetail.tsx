import { useMemo, useState } from "react";
import { DataTable } from "../components/DataTable";
import { SectionHeader } from "../components/SectionHeader";
import type { PokDetailItem } from "../types/procurement";
import { rupiah } from "../utils/format";

export function PokDetailPage({ rows }: { rows: PokDetailItem[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => rows.filter((row) => `${row["Mata Anggaran"]} ${row["Uraian Detail"]} ${row["Uraian Akun"]}`.toLowerCase().includes(query.toLowerCase())), [query, rows]);

  return (
    <>
      <SectionHeader title="POK Detail" subtitle={`${filtered.length} baris detail POK/DIPA`} />
      <input className="mb-4 w-full rounded border border-line bg-white px-3 py-2 md:w-96" placeholder="Cari program, akun, uraian detail" value={query} onChange={(event) => setQuery(event.target.value)} />
      <DataTable
        rows={filtered}
        columns={[
          { key: "ma", header: "Program/Kegiatan/KRO/RO/Komponen", render: (row) => row["Mata Anggaran"], className: "min-w-52" },
          { key: "akun", header: "Akun", render: (row) => row["Kode Akun"] },
          { key: "uraian", header: "Uraian detail", render: (row) => <div><p className="font-medium text-ink">{row["Uraian Detail"]}</p><p className="text-xs text-slate-500">{row["Uraian Akun"]}</p></div>, className: "min-w-80" },
          { key: "volume", header: "Volume", render: (row) => row.Volume ?? "-" },
          { key: "satuan", header: "Satuan", render: (row) => row.Satuan ?? "-" },
          { key: "harga", header: "Harga satuan", render: (row) => rupiah(row["Harga Satuan"]) },
          { key: "jumlah", header: "Jumlah biaya", render: (row) => rupiah(row["Pagu 2026"]) },
          { key: "realisasi", header: "Realisasi", render: (row) => rupiah(row["Realisasi s.d. Juni 2026"]) },
          { key: "sisa", header: "Sisa", render: (row) => rupiah(row.Sisa) },
        ]}
      />
    </>
  );
}

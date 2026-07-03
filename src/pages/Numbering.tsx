import { DataTable } from "../components/DataTable";
import { SectionHeader } from "../components/SectionHeader";
import type { RegisterItem } from "../types/procurement";

const defaults = [
  "PBJ-[TAHUN]-[AKUN]-[URUT]",
  "ND-{URUT}/{KODE_UNIT}/{BULAN_ROMAWI}/{TAHUN}",
  "S-{URUT}/{KODE_UNIT}/{BULAN_ROMAWI}/{TAHUN}",
  "SPK-{URUT}/{SATKER}/{TAHUN}",
  "BAST-{URUT}/{ID_PAKET}/{TAHUN}",
  "BAPP-{URUT}/{ID_PAKET}/{TAHUN}",
];

export function NumberingPage({ rows }: { rows: RegisterItem[] }) {
  return (
    <>
      <SectionHeader title="Tata Naskah dan Nomor" subtitle="Register nomor paket dan format tata naskah configurable." />
      <div className="mb-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {defaults.map((format) => <div key={format} className="rounded border border-line bg-white p-3 font-mono text-sm shadow-soft">{format}</div>)}
      </div>
      <DataTable
        rows={rows}
        columns={[
          { key: "jenis", header: "Jenis nomor", render: (row) => String(row["Jenis Nomor"] ?? "") },
          { key: "tahun", header: "Tahun", render: (row) => String(row.Tahun ?? "") },
          { key: "unit", header: "Kode unit", render: (row) => String(row["Kode Unit"] ?? "") },
          { key: "akun", header: "Akun belanja", render: (row) => String(row["Akun Belanja"] ?? "-") },
          { key: "last", header: "Last no", render: (row) => String(row["Last No"] ?? "") },
          { key: "format", header: "Format token", render: (row) => String(row["Format Token"] ?? ""), className: "font-mono min-w-72" },
          { key: "reset", header: "Reset rule", render: (row) => String(row["Reset Rule"] ?? "") },
        ]}
      />
    </>
  );
}

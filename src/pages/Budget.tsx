import { Badge } from "../components/Badge";
import { DataTable } from "../components/DataTable";
import { SectionHeader } from "../components/SectionHeader";
import type { BudgetItem } from "../types/procurement";
import { percent, rupiah } from "../utils/format";

export function BudgetPage({ budgets }: { budgets: BudgetItem[] }) {
  const totalPagu = budgets.reduce((sum, row) => sum + row["Pagu Akhir"], 0);
  const totalRealisasi = budgets.reduce((sum, row) => sum + row["Total Realisasi"], 0);
  const totalPbj = budgets.reduce((sum, row) => sum + row["Total Paket PBJ"], 0);

  return (
    <>
      <SectionHeader title="Anggaran dan Realisasi" subtitle="Ringkasan akun dari POK/DIPA, realisasi s.d. Juni, dan nilai PBJ." />
      <div className="mb-5 grid gap-4 md:grid-cols-3">
        <Summary label="Total pagu akhir" value={rupiah(totalPagu)} />
        <Summary label="Total realisasi" value={rupiah(totalRealisasi)} />
        <Summary label="Komitmen PBJ" value={rupiah(totalPbj)} />
      </div>
      <DataTable
        rows={budgets}
        columns={[
          { key: "akun", header: "Kode akun", render: (row) => row["Kode Akun"] },
          { key: "uraian", header: "Uraian akun", render: (row) => row["Uraian Akun"], className: "min-w-80" },
          { key: "pagu", header: "Pagu akhir", render: (row) => rupiah(row["Pagu Akhir"]), className: "whitespace-nowrap" },
          { key: "realisasi", header: "Realisasi", render: (row) => rupiah(row["Total Realisasi"]), className: "whitespace-nowrap" },
          { key: "sisa", header: "Sisa", render: (row) => rupiah(row["Sisa Anggaran"]), className: "whitespace-nowrap" },
          { key: "pbj", header: "Nilai PBJ", render: (row) => rupiah(row["Total Paket PBJ"]), className: "whitespace-nowrap" },
          { key: "persen", header: "% Realisasi", render: (row) => percent(row["% Realisasi"]) },
          { key: "status", header: "Indikator", render: (row) => <Badge value={indicator(row)} /> },
        ]}
      />
    </>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-line bg-white p-4 shadow-soft">
      <p className="text-sm text-slate-600">{label}</p>
      <p className="mt-2 text-xl font-bold text-ink">{value}</p>
    </div>
  );
}

function indicator(row: BudgetItem) {
  if (row["Total Realisasi"] > row["Pagu Akhir"] || row["Total Paket PBJ"] > row["Pagu Akhir"]) return "Merah - melebihi pagu";
  if (row["% Realisasi"] > 0.9 || row["Total Paket PBJ"] / Math.max(row["Pagu Akhir"], 1) > 0.9) return "Kuning - perlu perhatian";
  return "Hijau - aman";
}

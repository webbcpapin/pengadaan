import { AlertTriangle, CheckCircle2, CircleDollarSign, FileWarning, Package, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge } from "../components/Badge";
import { SectionHeader } from "../components/SectionHeader";
import type { AppSeed, PackageItem } from "../types/procurement";
import { accountCode, compactNumber, rupiah } from "../utils/format";

const palette = ["#126b63", "#d9902f", "#cf3f34", "#4f7cac", "#64748b", "#7c3aed"];

export function DashboardPage({ seed, packages }: { seed: AppSeed; packages: PackageItem[] }) {
  const docsMissing = seed.DATA_DOKUMEN.filter((row) => row["Wajib/Tidak"] === "Wajib" && row["Status Dokumen"] !== "Lengkap").length;
  const needFollowUp = packages.filter((row) => row["Perlu Tindak Lanjut"] === "Ya").length;
  const byStatus = groupCount(packages, "Status Pengadaan");
  const byMethod = groupCount(packages, "Metode Pengadaan");
  const byAccountValue = packages.reduce<Record<string, number>>((acc, row) => {
    const key = accountCode(row["Akun Belanja"]);
    acc[key] = (acc[key] ?? 0) + row["Nilai Kontrak/SPK"];
    return acc;
  }, {});
  const realizationByAccount = seed.DATA_ANGGARAN.slice(0, 8).map((row) => ({
    name: accountCode(row["Kode Akun"]),
    realisasi: row["Total Realisasi"],
    pagu: row["Pagu Akhir"],
  }));
  const incompleteByStage = Object.entries(
    seed.DATA_DOKUMEN.reduce<Record<string, number>>((acc, row) => {
      if (row["Status Dokumen"] !== "Lengkap") acc[row["Tahap Dokumen"]] = (acc[row["Tahap Dokumen"]] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name, value }));

  return (
    <>
      <SectionHeader
        title="Dashboard"
        subtitle={`${seed.META.satker} | TA ${seed.META.tahunAnggaran} | sumber ${seed.META.sourceWorkbook}`}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi icon={<CircleDollarSign />} label="Total pagu" value={rupiah(seed.META.alokasiDipa)} />
        <Kpi icon={<CheckCircle2 />} label="Total realisasi" value={rupiah(seed.META.totalRealisasiJuni)} />
        <Kpi icon={<AlertTriangle />} label="Sisa anggaran" value={rupiah(seed.META.sisaAnggaran)} />
        <Kpi icon={<Package />} label="Total paket PBJ" value={`${packages.length} paket`} />
        <Kpi icon={<CircleDollarSign />} label="Total nilai PBJ" value={rupiah(seed.META.totalNilaiPbj)} />
        <Kpi icon={<Users />} label="Jumlah penyedia" value={`${seed.DATA_PENYEDIA.length} penyedia`} />
        <Kpi icon={<FileWarning />} label="Dokumen belum lengkap" value={`${docsMissing} dokumen`} />
        <Kpi icon={<AlertTriangle />} label="Perlu tindak lanjut" value={`${needFollowUp} paket`} />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <ChartPanel title="Realisasi per akun">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={realizationByAccount}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={compactNumber} width={72} />
              <Tooltip formatter={(value) => rupiah(Number(value))} />
              <Legend />
              <Bar dataKey="pagu" fill="#9ab7c5" name="Pagu" />
              <Bar dataKey="realisasi" fill="#126b63" name="Realisasi" />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>
        <ChartPanel title="Paket per status">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={byStatus} dataKey="value" nameKey="name" outerRadius={100} label>
                {byStatus.map((_, index) => <Cell key={index} fill={palette[index % palette.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartPanel>
        <ChartPanel title="Paket per metode pengadaan">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={byMethod}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#d9902f" name="Paket" />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>
        <ChartPanel title="Nilai PBJ per akun">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={Object.entries(byAccountValue).map(([name, value]) => ({ name, value }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={compactNumber} width={72} />
              <Tooltip formatter={(value) => rupiah(Number(value))} />
              <Bar dataKey="value" fill="#4f7cac" name="Nilai PBJ" />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>
        <ChartPanel title="Dokumen belum lengkap per tahap">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={incompleteByStage}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#cf3f34" name="Dokumen" />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>
        <div className="rounded border border-line bg-white p-5 shadow-soft">
          <h2 className="text-base font-bold text-ink">Paket perlu perhatian</h2>
          <div className="mt-4 space-y-3">
            {packages.slice(0, 6).map((item) => (
              <div key={item["ID Paket"]} className="flex items-start justify-between gap-3 rounded border border-slate-100 p-3">
                <div>
                  <p className="font-medium text-ink">{item["Nama Paket"]}</p>
                  <p className="text-xs text-slate-500">{item["Kode Paket"]} | {rupiah(item["Nilai Kontrak/SPK"])}</p>
                </div>
                <Badge value={item["Risiko Administrasi"]} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function Kpi({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded border border-line bg-white p-4 shadow-soft">
      <div className="flex items-center gap-3 text-brand">
        <span className="grid h-9 w-9 place-items-center rounded bg-emerald-50">{icon}</span>
        <p className="text-sm font-medium text-slate-600">{label}</p>
      </div>
      <p className="mt-3 text-xl font-bold text-ink">{value}</p>
    </div>
  );
}

function ChartPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded border border-line bg-white p-5 shadow-soft">
      <h2 className="mb-4 text-base font-bold text-ink">{title}</h2>
      {children}
    </section>
  );
}

function groupCount<T>(rows: T[], key: keyof T) {
  return Object.entries(
    rows.reduce<Record<string, number>>((acc, row) => {
      const name = String(row[key] ?? "-");
      acc[name] = (acc[name] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name, value }));
}

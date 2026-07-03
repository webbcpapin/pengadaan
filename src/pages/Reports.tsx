import { Printer } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "../components/Badge";
import { SectionHeader } from "../components/SectionHeader";
import type { DocumentItem, PackageItem } from "../types/procurement";
import { rupiah } from "../utils/format";

export function ReportsPage({ packages, documents }: { packages: PackageItem[]; documents: DocumentItem[] }) {
  const [selectedId, setSelectedId] = useState(packages[0]?.["ID Paket"] ?? "");
  const selected = packages.find((item) => item["ID Paket"] === selectedId);
  const packageDocs = useMemo(() => documents.filter((doc) => doc["ID Paket"] === selectedId), [documents, selectedId]);
  const missingDocs = packageDocs.filter((doc) => doc["Wajib/Tidak"] === "Wajib" && doc["Status Dokumen"] !== "Lengkap");

  return (
    <>
      <SectionHeader
        title="Laporan Paket"
        subtitle="Halaman siap cetak untuk ringkasan pengadaan per paket."
        action={<button className="no-print inline-flex items-center gap-2 rounded bg-brand px-4 py-2 text-sm font-semibold text-white" onClick={() => window.print()}><Printer size={18} />Print</button>}
      />
      <select className="no-print mb-4 w-full rounded border border-line bg-white px-3 py-2 md:w-[420px]" value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
        {packages.map((item) => <option key={item["ID Paket"]} value={item["ID Paket"]}>{item["Kode Paket"]} - {item["Nama Paket"]}</option>)}
      </select>
      {selected ? (
        <article className="rounded border border-line bg-white p-6 shadow-soft">
          <div className="flex flex-col justify-between gap-3 border-b border-line pb-5 md:flex-row">
            <div>
              <p className="text-sm font-semibold uppercase text-slate-500">{selected["Kode Paket"]}</p>
              <h2 className="mt-1 text-2xl font-bold text-ink">{selected["Nama Paket"]}</h2>
            </div>
            <Badge value={selected["Status Pengadaan"]} />
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <ReportField label="Nilai pagu" value={rupiah(selected["Pagu Anggaran"])} />
            <ReportField label="Nilai HPS" value={rupiah(selected["Nilai HPS"])} />
            <ReportField label="Nilai kontrak" value={rupiah(selected["Nilai Kontrak/SPK"])} />
            <ReportField label="Penyedia" value={selected["Nama Penyedia"]} />
            <ReportField label="Metode" value={selected["Metode Pengadaan"]} />
            <ReportField label="Jenis kontrak" value={selected["Jenis Kontrak"]} />
            <ReportField label="Timeline" value={`${selected["Tanggal Mulai"] ?? "-"} s.d. ${selected["Tanggal Selesai"] ?? "-"}`} />
            <ReportField label="Folder Drive" value={selected["Link Folder Drive"] ?? "Belum ada link"} />
            <ReportField label="Catatan risiko" value={selected["Risiko Administrasi"]} />
          </div>
          <section className="mt-6">
            <h3 className="font-bold text-ink">Dokumen belum lengkap</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {missingDocs.length ? missingDocs.map((doc) => <Badge key={doc["ID Dokumen"]} value={doc["Nama Dokumen"]} />) : <Badge value="Lengkap" />}
            </div>
          </section>
          <section className="mt-6">
            <h3 className="font-bold text-ink">Daftar dokumen</h3>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {packageDocs.map((doc) => (
                <div key={doc["ID Dokumen"]} className="flex items-center justify-between rounded border border-slate-100 px-3 py-2 text-sm">
                  <span>{doc["Nama Dokumen"]}</span>
                  <Badge value={doc["Status Dokumen"]} />
                </div>
              ))}
            </div>
          </section>
        </article>
      ) : null}
    </>
  );
}

function ReportField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-slate-100 p-3">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-1 font-medium text-ink">{value}</p>
    </div>
  );
}

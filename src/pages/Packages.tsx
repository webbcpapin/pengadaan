import { Plus, Save, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "../components/Badge";
import { DataTable } from "../components/DataTable";
import { SectionHeader } from "../components/SectionHeader";
import { getSettings } from "../lib/storage";
import { submitPackageToAppsScript } from "../lib/appsScriptClient";
import type { AppSeed, PackageItem } from "../types/procurement";
import { accountCode, rupiah } from "../utils/format";

export function PackagesPage({
  packages,
  seed,
  onAddPackage,
}: {
  packages: PackageItem[];
  seed: AppSeed;
  onAddPackage: (item: PackageItem) => void;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [account, setAccount] = useState("");
  const [method, setMethod] = useState("");
  const [selected, setSelected] = useState<PackageItem | null>(packages[0] ?? null);
  const [formOpen, setFormOpen] = useState(false);
  const [message, setMessage] = useState("");

  const filtered = packages.filter((item) => {
    const haystack = `${item["Nama Paket"]} ${item["Kode Paket"]} ${item["Nama Penyedia"]}`.toLowerCase();
    return (
      haystack.includes(query.toLowerCase()) &&
      (!status || item["Status Pengadaan"] === status) &&
      (!account || accountCode(item["Akun Belanja"]) === account) &&
      (!method || item["Metode Pengadaan"] === method)
    );
  });

  const filters = useMemo(() => ({
    statuses: unique(packages.map((item) => item["Status Pengadaan"])),
    accounts: unique(packages.map((item) => accountCode(item["Akun Belanja"]))),
    methods: unique(packages.map((item) => item["Metode Pengadaan"])),
  }), [packages]);

  async function handleAdd(item: PackageItem) {
    const settings = getSettings();
    try {
      const result = await submitPackageToAppsScript(settings, item);
      onAddPackage(item);
      setMessage(result.mode === "remote" ? "Paket terkirim ke Apps Script dan disimpan lokal." : "Endpoint belum diatur. Paket disimpan sebagai Draft Lokal.");
    } catch (error) {
      onAddPackage(item);
      setMessage(`Apps Script gagal, paket tetap disimpan lokal. ${(error as Error).message}`);
    }
    setSelected(item);
    setFormOpen(false);
  }

  return (
    <>
      <SectionHeader
        title="Paket Pengadaan"
        subtitle={`${filtered.length} dari ${packages.length} paket tampil`}
        action={<button className="inline-flex items-center gap-2 rounded bg-brand px-4 py-2 text-sm font-semibold text-white" onClick={() => setFormOpen(true)}><Plus size={18} />Tambah Paket</button>}
      />
      {message ? <div className="mb-4 rounded border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</div> : null}
      <div className="mb-4 grid gap-3 rounded border border-line bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
        <input className="rounded border border-line px-3 py-2" placeholder="Cari paket, kode, penyedia" value={query} onChange={(event) => setQuery(event.target.value)} />
        <Select value={status} onChange={setStatus} options={filters.statuses} placeholder="Semua status" />
        <Select value={account} onChange={setAccount} options={filters.accounts} placeholder="Semua akun" />
        <Select value={method} onChange={setMethod} options={filters.methods} placeholder="Semua metode" />
      </div>
      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <DataTable
          rows={filtered}
          columns={[
            { key: "kode", header: "Kode", render: (row) => <button className="font-semibold text-brand" onClick={() => setSelected(row)}>{row["Kode Paket"]}</button> },
            { key: "paket", header: "Nama paket", render: (row) => <div><p className="font-medium text-ink">{row["Nama Paket"]}</p><p className="text-xs text-slate-500">{row["Nama Penyedia"]}</p></div> },
            { key: "akun", header: "Akun", render: (row) => accountCode(row["Akun Belanja"]) },
            { key: "metode", header: "Metode", render: (row) => row["Metode Pengadaan"] },
            { key: "nilai", header: "Nilai kontrak", render: (row) => rupiah(row["Nilai Kontrak/SPK"]), className: "whitespace-nowrap" },
            { key: "status", header: "Status", render: (row) => <Badge value={row["Status Dokumen"]} /> },
          ]}
        />
        <aside className="rounded border border-line bg-white p-5 shadow-soft">
          <h2 className="text-base font-bold text-ink">Detail Paket</h2>
          {selected ? (
            <div className="mt-4 space-y-3 text-sm">
              <Detail label="Kode paket" value={selected["Kode Paket"]} />
              <Detail label="Nama paket" value={selected["Nama Paket"]} />
              <Detail label="Pagu" value={rupiah(selected["Pagu Anggaran"])} />
              <Detail label="Nilai HPS" value={rupiah(selected["Nilai HPS"])} />
              <Detail label="Nilai kontrak" value={rupiah(selected["Nilai Kontrak/SPK"])} />
              <Detail label="Realisasi terkait" value={rupiah(seed.DATA_ANGGARAN.find((row) => selected["Akun Belanja"].includes(accountCode(row["Kode Akun"])))?.["Total Realisasi"] ?? 0)} />
              <Detail label="Sisa anggaran" value={rupiah(seed.DATA_ANGGARAN.find((row) => selected["Akun Belanja"].includes(accountCode(row["Kode Akun"])))?.["Sisa Anggaran"] ?? 0)} />
              <Detail label="Penyedia" value={selected["Nama Penyedia"]} />
              <Detail label="Status pembayaran" value={selected["Status Pembayaran"]} />
              <Detail label="PIC" value={selected.PIC} />
              <Detail label="Folder Drive" value={selected["Link Folder Drive"] || "Belum ada link"} />
              <div className="pt-2"><Badge value={selected["Risiko Administrasi"]} /></div>
            </div>
          ) : <p className="mt-4 text-sm text-slate-500">Pilih paket untuk melihat detail.</p>}
        </aside>
      </div>
      {formOpen ? <PackageForm packages={packages} onClose={() => setFormOpen(false)} onSubmit={handleAdd} /> : null}
    </>
  );
}

function PackageForm({ packages, onClose, onSubmit }: { packages: PackageItem[]; onClose: () => void; onSubmit: (item: PackageItem) => void }) {
  const [form, setForm] = useState({
    tahun: "2026",
    nama: "",
    unit: "Umum/PPK",
    jenisBelanja: "Belanja Barang",
    akun: "",
    metode: "",
    jenisKontrak: "Bukti Pembelian/Pembayaran",
    pagu: "",
    hps: "",
    kontrak: "",
    penyedia: "",
    mulai: "",
    selesai: "",
    pic: "PPK/PBJ",
    catatan: "",
  });
  const [error, setError] = useState("");

  function set(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function submit() {
    const pagu = Number(form.pagu);
    const kontrak = Number(form.kontrak);
    if (!form.nama.trim()) return setError("Nama paket wajib diisi.");
    if (!form.metode.trim()) return setError("Metode pengadaan wajib diisi.");
    if (!form.akun.trim()) return setError("Akun belanja wajib diisi.");
    if (!Number.isFinite(pagu) || !Number.isFinite(kontrak)) return setError("Pagu dan nilai kontrak harus angka.");
    if (kontrak > pagu && !form.catatan.trim()) return setError("Nilai kontrak melebihi pagu. Isi catatan pengecualian.");
    if (form.mulai && form.selesai && form.selesai < form.mulai) return setError("Tanggal selesai tidak boleh lebih awal dari tanggal mulai.");

    const akun = accountCode(form.akun);
    const sequence = packages.filter((item) => accountCode(item["Akun Belanja"]) === akun).length + 1;
    const item: PackageItem = {
      "ID Paket": `PKT-2026-${String(packages.length + 1).padStart(4, "0")}`,
      "Kode Paket": `PBJ-${form.tahun}-${akun}-${String(sequence).padStart(3, "0")}`,
      "Tahun Anggaran": Number(form.tahun),
      "Nama Paket": form.nama,
      "Unit/Seksi Pemohon": form.unit,
      "Jenis Belanja": form.jenisBelanja,
      "Akun Belanja": form.akun,
      "Metode Pengadaan": form.metode,
      "Jenis Kontrak": form.jenisKontrak,
      "Pagu Anggaran": pagu,
      "Nilai HPS": form.hps ? Number(form.hps) : null,
      "Nilai Kontrak/SPK": kontrak,
      "Nama Penyedia": form.penyedia,
      "Tanggal Mulai": form.mulai || null,
      "Tanggal Selesai": form.selesai || null,
      "Status Pengadaan": "Draft Lokal",
      "Status Dokumen": "Belum Ada",
      "Status Pembayaran": "Belum Diajukan",
      "Link Folder Drive": null,
      PIC: form.pic,
      Catatan: form.catatan,
      "Risiko Administrasi": "Perlu Verifikasi",
      "Perlu Tindak Lanjut": "Ya",
    };
    onSubmit(item);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/45 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded bg-white shadow-soft">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-lg font-bold text-ink">Tambah Paket</h2>
          <button title="Tutup" onClick={onClose} className="rounded p-2 hover:bg-slate-100"><X size={20} /></button>
        </div>
        <div className="grid gap-4 p-5 md:grid-cols-2">
          <Field label="Tahun Anggaran" value={form.tahun} onChange={(value) => set("tahun", value)} />
          <Field label="Nama Paket" value={form.nama} onChange={(value) => set("nama", value)} />
          <Field label="Unit/Seksi Pemohon" value={form.unit} onChange={(value) => set("unit", value)} />
          <Field label="Jenis Belanja" value={form.jenisBelanja} onChange={(value) => set("jenisBelanja", value)} />
          <Field label="Akun Belanja" value={form.akun} onChange={(value) => set("akun", value)} />
          <Field label="Metode Pengadaan" value={form.metode} onChange={(value) => set("metode", value)} />
          <Field label="Jenis Kontrak" value={form.jenisKontrak} onChange={(value) => set("jenisKontrak", value)} />
          <Field label="Pagu Anggaran" value={form.pagu} onChange={(value) => set("pagu", value)} />
          <Field label="Nilai HPS" value={form.hps} onChange={(value) => set("hps", value)} />
          <Field label="Nilai Kontrak/SPK" value={form.kontrak} onChange={(value) => set("kontrak", value)} />
          <Field label="Penyedia" value={form.penyedia} onChange={(value) => set("penyedia", value)} />
          <Field label="PIC" value={form.pic} onChange={(value) => set("pic", value)} />
          <Field label="Tanggal Mulai" type="date" value={form.mulai} onChange={(value) => set("mulai", value)} />
          <Field label="Tanggal Selesai" type="date" value={form.selesai} onChange={(value) => set("selesai", value)} />
          <label className="md:col-span-2">
            <span className="text-sm font-medium text-slate-700">Catatan</span>
            <textarea className="mt-1 min-h-24 w-full rounded border border-line px-3 py-2" value={form.catatan} onChange={(event) => set("catatan", event.target.value)} />
          </label>
          {error ? <p className="md:col-span-2 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        </div>
        <div className="flex justify-end gap-3 border-t border-line px-5 py-4">
          <button className="rounded border border-line px-4 py-2 text-sm font-semibold" onClick={onClose}>Batal</button>
          <button className="inline-flex items-center gap-2 rounded bg-brand px-4 py-2 text-sm font-semibold text-white" onClick={submit}><Save size={18} />Simpan</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input className="mt-1 w-full rounded border border-line px-3 py-2" type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function Select({ value, onChange, options, placeholder }: { value: string; onChange: (value: string) => void; options: string[]; placeholder: string }) {
  return (
    <select className="rounded border border-line px-3 py-2" value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="">{placeholder}</option>
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-slate-100 pb-2">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-ink">{value}</p>
    </div>
  );
}

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))].sort();
}

import { Save } from "lucide-react";
import { useState } from "react";
import { SectionHeader } from "../components/SectionHeader";
import { getSettings, saveSettings } from "../lib/storage";
import type { Settings } from "../types/procurement";

const labels: Record<keyof Settings, string> = {
  appsScriptUrl: "Apps Script Web App URL",
  rootFolderId: "Root Folder ID Google Drive",
  kodeSatker: "Kode Satker",
  namaSatker: "Nama Satker",
  tahunAnggaran: "Tahun Anggaran",
  kodeUnit: "Kode Unit",
  namaPpk: "Nama PPK",
  nipPpk: "NIP PPK",
  namaKpa: "Nama KPA",
  nipKpa: "NIP KPA",
  namaPbj: "Nama PBJ",
  nipPbj: "NIP PBJ",
};

export function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(() => getSettings());
  const [saved, setSaved] = useState(false);

  function update(key: keyof Settings, value: string) {
    setSettings((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  function submit() {
    saveSettings(settings);
    setSaved(true);
  }

  return (
    <>
      <SectionHeader title="Pengaturan" subtitle="Konfigurasi lokal browser. Jangan simpan secret atau token di frontend." />
      <div className="rounded border border-line bg-white p-5 shadow-soft">
        <div className="grid gap-4 md:grid-cols-2">
          {(Object.keys(labels) as Array<keyof Settings>).map((key) => (
            <label key={key}>
              <span className="text-sm font-medium text-slate-700">{labels[key]}</span>
              <input className="mt-1 w-full rounded border border-line px-3 py-2" value={settings[key]} onChange={(event) => update(key, event.target.value)} />
            </label>
          ))}
        </div>
        <div className="mt-5 flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded bg-brand px-4 py-2 text-sm font-semibold text-white" onClick={submit}><Save size={18} />Simpan Pengaturan</button>
          {saved ? <p className="text-sm font-medium text-emerald-700">Pengaturan tersimpan di localStorage.</p> : null}
        </div>
      </div>
    </>
  );
}

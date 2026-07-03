import type { PackageItem, Settings } from "../types/procurement";

const SETTINGS_KEY = "pengadaan.settings";
const PACKAGES_KEY = "pengadaan.localPackages";

export const defaultSettings: Settings = {
  appsScriptUrl: "",
  rootFolderId: "",
  kodeSatker: "636722",
  namaSatker: "KPPBC TMP C Pangkalpinang",
  tahunAnggaran: "2026",
  kodeUnit: "KBC.0503",
  namaPpk: "",
  nipPpk: "",
  namaKpa: "",
  nipKpa: "",
  namaPbj: "",
  nipPbj: "",
};

function readJson<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function getSettings(): Settings {
  return { ...defaultSettings, ...readJson<Partial<Settings>>(SETTINGS_KEY, {}) };
}

export function saveSettings(settings: Settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function getLocalPackages(): PackageItem[] {
  return readJson<PackageItem[]>(PACKAGES_KEY, []);
}

export function saveLocalPackages(packages: PackageItem[]) {
  localStorage.setItem(PACKAGES_KEY, JSON.stringify(packages));
}

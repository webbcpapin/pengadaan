import type { PackageItem, Settings } from "../types/procurement";

export async function submitPackageToAppsScript(settings: Settings, item: PackageItem) {
  if (!settings.appsScriptUrl) {
    return { ok: false, mode: "local" as const };
  }

  const response = await fetch(settings.appsScriptUrl, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action: "createPackage", payload: item }),
  });

  if (!response.ok) {
    throw new Error(`Apps Script gagal merespons: ${response.status}`);
  }

  return { ok: true, mode: "remote" as const, data: await response.json().catch(() => null) };
}

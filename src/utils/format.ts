import type { StatusTone } from "../types/procurement";

export function rupiah(value: number | null | undefined) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

export function percent(value: number | null | undefined) {
  return `${Math.round((value ?? 0) * 1000) / 10}%`;
}

export function compactNumber(value: number | null | undefined) {
  return new Intl.NumberFormat("id-ID", { notation: "compact", maximumFractionDigits: 1 }).format(value ?? 0);
}

export function statusTone(status: string | null | undefined): StatusTone {
  const value = (status ?? "").toLowerCase();
  if (/(selesai|lengkap|aman|dibayar|terbit|pkp)/.test(value)) return "green";
  if (/(proses|perlu|sebagian|berjalan|konfirmasi|revisi|terserap)/.test(value)) return "yellow";
  if (/(terlambat|tidak|risiko|over|melebihi)/.test(value)) return "red";
  if (/(draft|ditunda|batal|belum)/.test(value)) return "gray";
  return "blue";
}

export function accountCode(account: string) {
  const match = account.match(/\d{6}/);
  return match?.[0] ?? account;
}

export function monthRoman(date = new Date()) {
  return ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"][date.getMonth()];
}

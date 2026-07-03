import { statusTone } from "../utils/format";

const toneClass = {
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  yellow: "bg-amber-50 text-amber-800 ring-amber-200",
  red: "bg-red-50 text-red-700 ring-red-200",
  gray: "bg-slate-100 text-slate-700 ring-slate-200",
  blue: "bg-sky-50 text-sky-700 ring-sky-200",
};

export function Badge({ value }: { value: string | null | undefined }) {
  const tone = statusTone(value);
  return (
    <span className={`inline-flex whitespace-nowrap rounded px-2 py-1 text-xs font-semibold ring-1 ${toneClass[tone]}`}>
      {value || "-"}
    </span>
  );
}

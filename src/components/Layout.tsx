import {
  Archive,
  BarChart3,
  ClipboardCheck,
  FileSpreadsheet,
  FileText,
  FolderArchive,
  Landmark,
  LayoutDashboard,
  Package,
  ScrollText,
  Settings,
  Users,
} from "lucide-react";
import type { PageKey } from "../App";

const nav = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "packages", label: "Paket Pengadaan", icon: Package },
  { key: "budget", label: "Anggaran dan Realisasi", icon: BarChart3 },
  { key: "pok", label: "POK Detail", icon: FileSpreadsheet },
  { key: "providers", label: "Penyedia", icon: Users },
  { key: "documents", label: "Dokumen", icon: FolderArchive },
  { key: "checklist", label: "Checklist Administrasi", icon: ClipboardCheck },
  { key: "reports", label: "Laporan Paket", icon: FileText },
  { key: "numbers", label: "Tata Naskah dan Nomor", icon: ScrollText },
  { key: "archive", label: "Arsip Drive", icon: Archive },
  { key: "settings", label: "Pengaturan", icon: Settings },
] as const;

export function Layout({
  active,
  onNavigate,
  children,
}: {
  active: PageKey;
  onNavigate: (page: PageKey) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#edf2f6] lg:flex">
      <aside className="no-print border-b border-line bg-white lg:fixed lg:inset-y-0 lg:w-72 lg:border-b-0 lg:border-r">
        <div className="border-b border-line px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded bg-brand text-white">
              <Landmark size={22} />
            </div>
            <div>
              <p className="text-sm font-bold text-ink">Pengadaan PPK dan PBJ</p>
              <p className="text-xs text-slate-500">KPPBC TMP C Pangkalpinang</p>
            </div>
          </div>
        </div>
        <nav className="flex gap-2 overflow-x-auto px-3 py-3 lg:block lg:space-y-1 lg:overflow-visible">
          {nav.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onNavigate(item.key)}
                title={item.label}
                className={`flex min-w-fit items-center gap-3 rounded px-3 py-2.5 text-left text-sm font-medium transition lg:w-full ${
                  isActive ? "bg-brand text-white" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
      <main className="lg:ml-72 lg:min-h-screen lg:flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}

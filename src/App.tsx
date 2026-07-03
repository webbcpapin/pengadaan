import { useState } from "react";
import { Layout } from "./components/Layout";
import { useProcurementData } from "./hooks/useProcurementData";
import { ArchivePage } from "./pages/Archive";
import { BudgetPage } from "./pages/Budget";
import { ChecklistPage } from "./pages/Checklist";
import { DashboardPage } from "./pages/Dashboard";
import { DocumentsPage } from "./pages/Documents";
import { NumberingPage } from "./pages/Numbering";
import { PackagesPage } from "./pages/Packages";
import { PokDetailPage } from "./pages/PokDetail";
import { ProvidersPage } from "./pages/Providers";
import { ReportsPage } from "./pages/Reports";
import { SettingsPage } from "./pages/Settings";

export type PageKey =
  | "dashboard"
  | "packages"
  | "budget"
  | "pok"
  | "providers"
  | "documents"
  | "checklist"
  | "reports"
  | "numbers"
  | "archive"
  | "settings";

function App() {
  const [active, setActive] = useState<PageKey>("dashboard");
  const data = useProcurementData();

  const page = {
    dashboard: <DashboardPage seed={data.seed} packages={data.packages} />,
    packages: <PackagesPage packages={data.packages} seed={data.seed} onAddPackage={data.addLocalPackage} />,
    budget: <BudgetPage budgets={data.seed.DATA_ANGGARAN} />,
    pok: <PokDetailPage rows={data.seed.POK_DETAIL} />,
    providers: <ProvidersPage rows={data.seed.DATA_PENYEDIA} />,
    documents: <DocumentsPage rows={data.seed.DATA_DOKUMEN} />,
    checklist: <ChecklistPage rows={data.seed.CHECKLIST_ADMINISTRASI} />,
    reports: <ReportsPage packages={data.packages} documents={data.seed.DATA_DOKUMEN} />,
    numbers: <NumberingPage rows={data.seed.NOMOR_REGISTER} />,
    archive: <ArchivePage rows={data.seed.ARSIP} />,
    settings: <SettingsPage />,
  }[active];

  return (
    <Layout active={active} onNavigate={setActive}>
      {page}
    </Layout>
  );
}

export default App;

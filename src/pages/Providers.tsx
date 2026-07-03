import { Badge } from "../components/Badge";
import { DataTable } from "../components/DataTable";
import { SectionHeader } from "../components/SectionHeader";
import type { ProviderItem } from "../types/procurement";

export function ProvidersPage({ rows }: { rows: ProviderItem[] }) {
  return (
    <>
      <SectionHeader title="Penyedia" subtitle={`${rows.length} penyedia awal dari data PBJ`} />
      <DataTable
        rows={rows}
        columns={[
          { key: "nama", header: "Nama penyedia", render: (row) => <strong>{row["Nama Penyedia"]}</strong>, className: "min-w-64" },
          { key: "bentuk", header: "Bentuk usaha", render: (row) => row["Bentuk Usaha"] },
          { key: "npwp", header: "NPWP", render: (row) => row.NPWP ?? "-" },
          { key: "nib", header: "NIB", render: (row) => row.NIB ?? "-" },
          { key: "alamat", header: "Alamat", render: (row) => row.Alamat ?? "-", className: "min-w-64" },
          { key: "pic", header: "PIC", render: (row) => row["Nama PIC"] ?? "-" },
          { key: "hp", header: "Nomor HP", render: (row) => row["Nomor HP"] ?? "-" },
          { key: "email", header: "Email", render: (row) => row.Email ?? "-" },
          { key: "rekening", header: "Rekening", render: (row) => row["Nomor Rekening"] ?? "-" },
          { key: "bank", header: "Bank", render: (row) => row["Nama Bank"] ?? "-" },
          { key: "pkp", header: "Status PKP", render: (row) => <Badge value={row["Status PKP"]} /> },
          { key: "catatan", header: "Catatan", render: (row) => row.Catatan ?? "-", className: "min-w-72" },
        ]}
      />
    </>
  );
}

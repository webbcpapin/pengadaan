/**
 * DashboardService.gs
 * Formula dashboard, laporan paket, dan ringkasan anggaran.
 */
function updateDashboard() {
  const sh = getSheet_(APP_CONFIG.SHEETS.DASHBOARD);
  const formulas = {
    'B5': '=COUNTA(DATA_PAKET!A2:A1000)',
    'B6': '=COUNTIF(DATA_PAKET!S2:S1000,"Dibayar")',
    'B7': '=COUNTIF(DATA_PAKET!R2:R1000,"<>Lengkap")-COUNTBLANK(DATA_PAKET!R2:R1000)',
    'B8': '=COUNTIF(DATA_PAKET!Z2:Z1000,"<>Aman")-COUNTBLANK(DATA_PAKET!Z2:Z1000)',
    'B9': '=COUNTIF(DATA_PAKET!H2:H1000,"E-Purchasing")',
    'E5': '=SUM(DATA_PAKET!L2:L1000)',
    'E6': '=SUMIFS(DATA_PAKET!L2:L1000,DATA_PAKET!S2:S1000,"Dibayar")',
    'E7': '=COUNTIF(DATA_PAKET!AA2:AA1000,"Ya")',
    'E8': '=SUM(DATA_ANGGARAN!L2:L1000)',
    'E9': '=COUNTIF(DATA_PAKET!H2:H1000,"Pengadaan Langsung")',
    'H5': '=SUM(DATA_ANGGARAN!F2:F1000)',
    'H6': '=SUM(DATA_ANGGARAN!H2:H1000)',
    'H7': '=SUM(DATA_ANGGARAN!I2:I1000)',
    'H8': '=SUM(DATA_ANGGARAN!M2:M1000)',
    'H9': '=IFERROR(SUM(DATA_ANGGARAN!H2:H1000)/SUM(DATA_ANGGARAN!F2:F1000),0)'
  };
  Object.keys(formulas).forEach(function(a1) {
    sh.getRange(a1).setFormula(formulas[a1]);
  });
  syncPackageTotalsToBudget();
  SpreadsheetApp.flush();
  logActivity('UPDATE_DASHBOARD', '', 'Dashboard dan total anggaran diperbarui');
}

function buildPackageReport(packageId) {
  const pkg = getPackageObjectById(packageId);
  if (!pkg) throw new Error('ID Paket tidak ditemukan: ' + packageId);
  const sh = getSheet_(APP_CONFIG.SHEETS.LAPORAN);
  sh.getRange('B2').setValue(packageId);
  logActivity('BUILD_PACKAGE_REPORT', packageId, 'Laporan paket diperbarui');
}

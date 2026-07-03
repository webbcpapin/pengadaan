/**
 * Code.gs
 * Entry point menu Google Sheet.
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Aplikasi Pengadaan')
    .addItem('Tambah Paket Baru', 'showAddPackageForm')
    .addItem('Buat Folder Paket', 'showCreateFolderPrompt')
    .addItem('Update Checklist Dokumen', 'updateAllChecklistStatus')
    .addItem('Generate Dashboard', 'updateDashboard')
    .addItem('Sinkron Anggaran PBJ', 'syncPackageTotalsToBudget')
    .addItem('Cek Sisa Anggaran', 'showBudgetRisks')
    .addItem('Cek Dokumen Belum Lengkap', 'showMissingDocuments')
    .addItem('Buat Laporan Paket', 'showPackageReportPrompt')
    .addSeparator()
    .addItem('Refresh Data', 'refreshData')
    .addItem('Pengaturan', 'showSidebar')
    .addToUi();
}

function showAddPackageForm() {
  const html = HtmlService.createTemplateFromFile('AddPackageForm')
    .evaluate()
    .setWidth(720)
    .setHeight(760);
  SpreadsheetApp.getUi().showModalDialog(html, 'Tambah Paket Baru');
}

function showSidebar() {
  const html = HtmlService.createTemplateFromFile('Sidebar')
    .evaluate()
    .setTitle('Aplikasi Pengadaan');
  SpreadsheetApp.getUi().showSidebar(html);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function refreshData() {
  updateAllChecklistStatus();
  syncPackageTotalsToBudget();
  updateDashboard();
  SpreadsheetApp.flush();
  SpreadsheetApp.getUi().alert('Data berhasil di-refresh.');
}

function showCreateFolderPrompt() {
  const ui = SpreadsheetApp.getUi();
  const res = ui.prompt('Buat Folder Paket', 'Masukkan ID Paket:', ui.ButtonSet.OK_CANCEL);
  if (res.getSelectedButton() !== ui.Button.OK) return;
  const packageId = res.getResponseText().trim();
  const row = getPackageObjectById(packageId);
  if (!row) {
    ui.alert('ID Paket tidak ditemukan.');
    return;
  }
  const folder = createPackageFolder(row);
  updatePackageFolderLink(packageId, folder.getUrl());
  logActivity('CREATE_FOLDER_MANUAL', packageId, 'Folder dibuat/diperbarui: ' + folder.getUrl());
  ui.alert('Folder paket tersedia:\n' + folder.getUrl());
}

function showMissingDocuments() {
  const docs = checkMissingDocuments();
  const text = docs.length
    ? docs.slice(0, 25).map(function(d) {
        return d.idPaket + ' | ' + d.namaDokumen + ' | ' + d.statusDokumen;
      }).join('\n')
    : 'Tidak ada dokumen wajib yang belum lengkap.';
  SpreadsheetApp.getUi().alert('Dokumen Belum Lengkap', text, SpreadsheetApp.getUi().ButtonSet.OK);
}

function showPackageReportPrompt() {
  const ui = SpreadsheetApp.getUi();
  const res = ui.prompt('Laporan Paket', 'Masukkan ID Paket:', ui.ButtonSet.OK_CANCEL);
  if (res.getSelectedButton() !== ui.Button.OK) return;
  const packageId = res.getResponseText().trim();
  buildPackageReport(packageId);
  ui.alert('Laporan paket diperbarui di sheet LAPORAN_PAKET.');
}

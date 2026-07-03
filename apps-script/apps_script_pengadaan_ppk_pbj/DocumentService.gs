/**
 * DocumentService.gs
 * Mail merge sederhana Google Docs dari template.
 * MVP: aktif bila Template Doc ID sudah diisi di sheet TEMPLATE_MAP.
 */
function generateDocumentFromTemplate(packageId, docType) {
  const pkg = getPackageObjectById(packageId);
  if (!pkg) throw new Error('Paket tidak ditemukan: ' + packageId);

  const template = getTemplateRow_(docType);
  if (!template || !template['Template Doc ID']) {
    throw new Error('Template Doc ID belum diisi untuk jenis dokumen: ' + docType);
  }

  const packageFolder = getFolderFromPackage_(pkg);
  const file = DriveApp.getFileById(template['Template Doc ID']).makeCopy(
    renderPlaceholders_(template['Output Name Pattern'] || (docType + '-' + pkg['Kode Paket']), pkg),
    packageFolder
  );
  const doc = DocumentApp.openById(file.getId());
  const body = doc.getBody();
  const data = buildPlaceholderData_(pkg);
  Object.keys(data).forEach(function(key) {
    body.replaceText('\\{\\{' + key + '\\}\\}', String(data[key] || ''));
  });
  doc.saveAndClose();

  appendRowByHeaders_(APP_CONFIG.SHEETS.DATA_DOKUMEN, {
    'ID Dokumen': 'GEN-' + packageId + '-' + docType + '-' + new Date().getTime(),
    'ID Paket': packageId,
    'Nama Paket': pkg['Nama Paket'],
    'Tahap Dokumen': '10_Korespondensi',
    'Nama Dokumen': docType,
    'Wajib/Tidak': 'Sesuai Kebutuhan',
    'Status Dokumen': 'Lengkap',
    'Tanggal Upload': now_(),
    'Link File': file.getUrl(),
    'Catatan': 'Generated dari template',
    'Perlu Revisi': 'Tidak',
    'Updated At': now_()
  });
  logActivity('GENERATE_DOCUMENT', packageId, docType + ': ' + file.getUrl());
  return file.getUrl();
}

function getTemplateRow_(docType) {
  const rows = getObjects_(APP_CONFIG.SHEETS.TEMPLATE_MAP);
  return rows.find(function(r) { return String(r['Jenis Dokumen']).trim() === String(docType).trim(); }) || null;
}

function getFolderFromPackage_(pkg) {
  const url = pkg['Link Folder Drive'];
  if (!url) return createPackageFolder(pkg);
  const idMatch = String(url).match(/[-\w]{25,}/);
  if (idMatch) return DriveApp.getFolderById(idMatch[0]);
  return createPackageFolder(pkg);
}

function buildPlaceholderData_(pkg) {
  return {
    KODE_PAKET: pkg['Kode Paket'],
    NAMA_PAKET: pkg['Nama Paket'],
    TAHUN_ANGGARAN: pkg['Tahun Anggaran'],
    NAMA_SATKER: APP_CONFIG.SATKER_NAME,
    KODE_UNIT: APP_CONFIG.KODE_UNIT,
    UNIT_SEKSI: pkg['Unit/Seksi Pemohon'],
    JENIS_BELANJA: pkg['Jenis Belanja'],
    AKUN_BELANJA: pkg['Akun Belanja'],
    METODE_PENGADAAN: pkg['Metode Pengadaan'],
    JENIS_KONTRAK: pkg['Jenis Kontrak'],
    PAGU_ANGGARAN: pkg['Pagu Anggaran'],
    NILAI_HPS: pkg['Nilai HPS'],
    NILAI_KONTRAK: pkg['Nilai Kontrak/SPK'],
    NAMA_PENYEDIA: pkg['Nama Penyedia'],
    NPWP_PENYEDIA: pkg['NPWP Penyedia'],
    TANGGAL_MULAI: formatDate_(pkg['Tanggal Mulai']),
    TANGGAL_SELESAI: formatDate_(pkg['Tanggal Selesai']),
    PIC: pkg['PIC'],
    CATATAN: pkg['Catatan'],
    DRIVE_FOLDER_URL: pkg['Link Folder Drive'],
    TANGGAL_DOKUMEN: formatDate_(new Date()),
    KOTA_TANGGAL: 'Pangkalpinang, ' + formatDate_(new Date())
  };
}

function renderPlaceholders_(text, pkg) {
  const data = buildPlaceholderData_(pkg);
  return String(text).replace(/{{([A-Z_]+)}}/g, function(match, key) {
    return data[key] !== undefined ? data[key] : match;
  });
}

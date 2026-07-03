/**
 * MasterDataService.gs
 * Data dropdown untuk form HTML.
 */
function getMasterData() {
  const sh = getSheet_(APP_CONFIG.SHEETS.MASTER);
  const values = sh.getDataRange().getValues();
  const headers = values[0];
  const result = {};
  headers.forEach(function(header, col) {
    const key = masterKey_(header);
    result[key] = [];
    for (var r = 1; r < values.length; r++) {
      const val = values[r][col];
      if (val !== '' && val !== null) result[key].push(val);
    }
  });
  result.defaultYear = APP_CONFIG.DEFAULT_YEAR;
  result.kodeUnit = APP_CONFIG.KODE_UNIT;
  result.satkerName = APP_CONFIG.SATKER_NAME;
  return result;
}

function masterKey_(header) {
  const map = {
    'Status Pengadaan': 'statusPengadaan',
    'Metode Pengadaan': 'metodePengadaan',
    'Jenis Kontrak': 'jenisKontrak',
    'Jenis Belanja': 'jenisBelanja',
    'Status Dokumen': 'statusDokumen',
    'Status Pembayaran': 'statusPembayaran',
    'Unit/Seksi': 'unitSeksi',
    'Tahap Dokumen': 'tahapDokumen',
    'Status PKP': 'statusPkp',
    'Risiko Administrasi': 'risikoAdministrasi',
    'Wajib/Tidak': 'wajibTidak',
    'Perlu Revisi': 'perluRevisi',
    'Bentuk Usaha': 'bentukUsaha'
  };
  return map[header] || String(header).replace(/\W+(\w)/g, function(_, c) { return c.toUpperCase(); }).replace(/^\w/, function(c) { return c.toLowerCase(); });
}

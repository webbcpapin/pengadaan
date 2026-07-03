/**
 * PackageService.gs
 * Bisnis proses paket pengadaan.
 */
function addPackage(data) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const validation = validatePackageData(data);
    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }

    const year = String(data.tahunAnggaran);
    const account = String(data.akunBelanja || '').trim();
    const packageId = generatePackageId_(year);
    const packageCode = generatePackageCode(year, account);

    const packageObject = {
      'ID Paket': packageId,
      'Kode Paket': packageCode,
      'Tahun Anggaran': Number(year),
      'Nama Paket': data.namaPaket,
      'Unit/Seksi Pemohon': data.unitSeksi,
      'Jenis Belanja': data.jenisBelanja,
      'Akun Belanja': account,
      'Metode Pengadaan': data.metodePengadaan,
      'Jenis Kontrak': data.jenisKontrak,
      'Pagu Anggaran': toNumber_(data.paguAnggaran),
      'Nilai HPS': toNumber_(data.nilaiHps),
      'Nilai Kontrak/SPK': toNumber_(data.nilaiKontrak),
      'Nama Penyedia': data.namaPenyedia || '',
      'NPWP Penyedia': data.npwpPenyedia || '',
      'Tanggal Mulai': new Date(data.tanggalMulai),
      'Tanggal Selesai': new Date(data.tanggalSelesai),
      'Status Pengadaan': data.statusPengadaan || 'Draft',
      'Status Dokumen': data.statusDokumen || 'Belum Ada',
      'Status Pembayaran': data.statusPembayaran || 'Belum Diajukan',
      'Link Folder Drive': '',
      'PIC': data.pic,
      'Catatan': data.catatan || '',
      'Created At': now_(),
      'Updated At': now_()
    };

    const folder = createPackageFolder(packageObject);
    packageObject['Link Folder Drive'] = folder.getUrl();

    const row = appendRowByHeaders_(APP_CONFIG.SHEETS.DATA_PAKET, packageObject);
    setPackageFormulaRow_(row);
    createChecklist(packageId);
    createDocumentChecklistRows_(packageId, data.namaPaket, data.metodePengadaan, data.jenisKontrak);
    logActivity('ADD_PACKAGE', packageId, packageObject);
    syncPackageTotalsToBudget();
    updateDashboard();

    return {
      success: true,
      packageId: packageId,
      packageCode: packageCode,
      folderUrl: folder.getUrl()
    };
  } catch (err) {
    return { success: false, errors: [err.message] };
  } finally {
    lock.releaseLock();
  }
}

function generatePackageId_(year) {
  const props = PropertiesService.getScriptProperties();
  const key = 'PKG_ID_' + year;
  const current = Number(props.getProperty(key) || 0) + 1;
  props.setProperty(key, String(current));
  return APP_CONFIG.PACKAGE_ID_PREFIX + '-' + year + '-' + pad_(current, 4);
}

function generatePackageCode(year, account) {
  const unit = APP_CONFIG.KODE_UNIT;
  const docType = 'PAKET';
  const nextNo = getNextRegisterNo_(docType, year, unit, account || 'NONAKUN', APP_CONFIG.PACKAGE_CODE_FORMAT);
  return renderToken_(APP_CONFIG.PACKAGE_CODE_FORMAT, {
    TAHUN: year,
    AKUN: account || 'NONAKUN',
    NNN: pad_(nextNo, 3),
    KODE_UNIT: unit,
    BULAN_ROMAWI: romanMonth_(new Date().getMonth() + 1)
  });
}

function getNextRegisterNo_(docType, year, unitCode, account, formatToken) {
  const sh = getSheet_(APP_CONFIG.SHEETS.NOMOR_REGISTER);
  const map = getHeaderMap_(sh);
  const lastRow = sh.getLastRow();
  const rows = lastRow >= 2 ? sh.getRange(2, 1, lastRow - 1, sh.getLastColumn()).getValues() : [];
  for (var i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowDocType = String(row[map['Jenis Nomor'] - 1] || '');
    const rowYear = String(row[map['Tahun'] - 1] || '');
    const rowUnit = String(row[map['Kode Unit'] - 1] || '');
    const rowAccount = String(row[map['Akun Belanja'] - 1] || '');
    if (rowDocType === docType && rowYear === String(year) && rowUnit === unitCode && rowAccount === String(account || '')) {
      const next = Number(row[map['Last No'] - 1] || 0) + 1;
      sh.getRange(i + 2, map['Last No']).setValue(next);
      sh.getRange(i + 2, map['Updated At']).setValue(now_());
      logActivity('GENERATE_NUMBER', '', docType + ' ' + year + ' ' + unitCode + ' ' + account + ' -> ' + next);
      return next;
    }
  }

  const nextNo = 1;
  appendRowByHeaders_(APP_CONFIG.SHEETS.NOMOR_REGISTER, {
    'Jenis Nomor': docType,
    'Tahun': Number(year),
    'Kode Unit': unitCode,
    'Akun Belanja': account || '',
    'Last No': nextNo,
    'Format Token': formatToken,
    'Reset Rule': 'Tahunan + Akun',
    'Updated At': now_()
  });
  logActivity('GENERATE_NUMBER', '', docType + ' ' + year + ' ' + unitCode + ' ' + account + ' -> 1');
  return nextNo;
}

function getPackageObjectById(packageId) {
  const objects = getObjects_(APP_CONFIG.SHEETS.DATA_PAKET);
  return objects.find(function(o) { return String(o['ID Paket']).trim() === String(packageId).trim(); }) || null;
}

function setPackageFormulaRow_(row) {
  const sh = getSheet_(APP_CONFIG.SHEETS.DATA_PAKET);
  sh.getRange(row, 25).setFormula('=IF(A' + row + '="","",IF(P' + row + '="","",P' + row + '-TODAY()))');
  sh.getRange(row, 26).setFormula('=IF(A' + row + '="","",IF(Q' + row + '="Dibatalkan","Dibatalkan",IF(Q' + row + '="Ditunda","Ditunda",IF(AND(P' + row + '<TODAY(),Q' + row + '<>"Selesai"),"Terlambat",IF(OR(R' + row + '="Belum Ada",R' + row + '="Perlu Revisi"),"Dokumen Kurang",IF(Y' + row + '<=7,"Perlu Perhatian","Aman"))))))');
  sh.getRange(row, 27).setFormula('=IF(A' + row + '="","",IF(OR(Z' + row + '="Terlambat",Z' + row + '="Dokumen Kurang",Z' + row + '="Perlu Perhatian"),"Ya","Tidak"))');
}

function renderToken_(token, data) {
  return String(token).replace(/\{([A-Z_]+)\}/g, function(match, key) {
    return data[key] !== undefined ? data[key] : match;
  });
}

function pad_(num, width) {
  return String(num).padStart(width, '0');
}

function romanMonth_(month) {
  const romans = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];
  return romans[month - 1] || '';
}

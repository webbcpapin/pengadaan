/**
 * ChecklistService.gs
 * Checklist administrasi dan dokumen wajib.
 */
function createChecklist(packageId) {
  const pkg = getPackageObjectById(packageId);
  if (!pkg) throw new Error('Paket tidak ditemukan: ' + packageId);
  const existingRow = findRowByValue_(APP_CONFIG.SHEETS.CHECKLIST, 'ID Paket', packageId);
  if (existingRow) return existingRow;

  const rowObject = {
    'ID Paket': packageId,
    'Nama Paket': pkg['Nama Paket'],
    'KAK/TOR': 'Belum Ada',
    'RAB': 'Belum Ada',
    'HPS': 'Belum Ada',
    'Survey Harga': 'Belum Ada',
    'Nota Dinas Kebutuhan': 'Belum Ada',
    'Undangan Penawaran': 'Belum Ada',
    'Penawaran Penyedia': 'Belum Ada',
    'Evaluasi/Klarifikasi': 'Belum Ada',
    'Negosiasi': 'Belum Ada',
    'Penetapan Penyedia': 'Belum Ada',
    'SPK/Kontrak/Surat Pesanan': 'Belum Ada',
    'SPMK jika ada': 'Opsional',
    'Dokumentasi Pelaksanaan': 'Belum Ada',
    'BAST': 'Belum Ada',
    'BAPP jika ada': 'Sesuai Kebutuhan',
    'Invoice/Tagihan': 'Belum Ada',
    'Kuitansi': 'Belum Ada',
    'Faktur Pajak jika ada': 'Sesuai Kebutuhan',
    'Dokumen Pajak': 'Belum Ada',
    'SPTJB': 'Belum Ada',
    'SPP/SPM/SP2D jika diperlukan': 'Sesuai Kebutuhan',
    'Laporan Pelaksanaan': 'Belum Ada',
    'Status Lengkap': '',
    'Catatan': ''
  };
  const row = appendRowByHeaders_(APP_CONFIG.SHEETS.CHECKLIST, rowObject);
  getSheet_(APP_CONFIG.SHEETS.CHECKLIST).getRange(row, 25).setFormula('=IF(A' + row + '="","",IF(COUNTIF(C' + row + ':X' + row + ',"Perlu Revisi")>0,"Perlu Revisi",IF(COUNTIF(C' + row + ':X' + row + ',"Belum Ada")>0,"Sebagian","Lengkap")))');
  return row;
}

function createDocumentChecklistRows_(packageId, packageName, method, contractType) {
  const docs = buildRequiredDocs_(method, contractType);
  docs.forEach(function(doc, idx) {
    appendRowByHeaders_(APP_CONFIG.SHEETS.DATA_DOKUMEN, {
      'ID Dokumen': 'DOC-' + packageId.replace('PKT-', '') + '-' + pad_(idx + 1, 3),
      'ID Paket': packageId,
      'Nama Paket': packageName,
      'Tahap Dokumen': doc.tahap,
      'Nama Dokumen': doc.nama,
      'Wajib/Tidak': doc.wajib,
      'Status Dokumen': 'Belum Ada',
      'Tanggal Upload': '',
      'Link File': '',
      'Catatan': doc.catatan || '',
      'Perlu Revisi': 'Tidak',
      'Updated At': now_()
    });
  });
}

function buildRequiredDocs_(method, contractType) {
  const base = [
    { tahap: '01_Perencanaan', nama: 'KAK/TOR', wajib: 'Wajib' },
    { tahap: '01_Perencanaan', nama: 'RAB', wajib: 'Wajib' },
    { tahap: '02_Persiapan_Pengadaan', nama: 'HPS', wajib: 'Wajib' },
    { tahap: '02_Persiapan_Pengadaan', nama: 'Survey/Referensi Harga', wajib: 'Wajib' },
    { tahap: '02_Persiapan_Pengadaan', nama: 'Nota Dinas Kebutuhan', wajib: 'Wajib' },
    { tahap: '03_Pemilihan', nama: 'Penawaran Penyedia', wajib: 'Wajib' },
    { tahap: '03_Pemilihan', nama: 'Evaluasi/Klarifikasi', wajib: 'Wajib' },
    { tahap: '03_Pemilihan', nama: 'Negosiasi', wajib: method === 'Pengadaan Langsung' ? 'Wajib' : 'Sesuai Kebutuhan' },
    { tahap: '04_Kontrak_SPK', nama: contractType || 'SPK/Kontrak/Surat Pesanan', wajib: 'Wajib' },
    { tahap: '05_Pelaksanaan', nama: 'Dokumentasi Pelaksanaan', wajib: 'Wajib' },
    { tahap: '06_Serah_Terima', nama: 'BAST', wajib: 'Wajib' },
    { tahap: '07_Pembayaran', nama: 'Invoice/Tagihan', wajib: 'Wajib' },
    { tahap: '07_Pembayaran', nama: 'Kuitansi', wajib: 'Wajib' },
    { tahap: '08_Pajak', nama: 'Faktur Pajak', wajib: 'Sesuai Kebutuhan' },
    { tahap: '08_Pajak', nama: 'Dokumen Pajak/Bukti Potong', wajib: 'Sesuai Kebutuhan' },
    { tahap: '09_Laporan', nama: 'SPTJB', wajib: 'Wajib' },
    { tahap: '09_Laporan', nama: 'Laporan Pelaksanaan', wajib: 'Wajib' }
  ];

  if (method === 'E-purchasing') {
    base.splice(5, 0, { tahap: '03_Pemilihan', nama: 'Bukti Katalog/Etalase dan Surat Pesanan', wajib: 'Wajib' });
  }
  return base;
}

function updateAllChecklistStatus() {
  const sh = getSheet_(APP_CONFIG.SHEETS.CHECKLIST);
  const lastRow = sh.getLastRow();
  if (lastRow < 2) return;
  for (var r = 2; r <= lastRow; r++) {
    if (sh.getRange(r, 1).getValue()) {
      sh.getRange(r, 25).setFormula('=IF(A' + r + '="","",IF(COUNTIF(C' + r + ':X' + r + ',"Perlu Revisi")>0,"Perlu Revisi",IF(COUNTIF(C' + r + ':X' + r + ',"Belum Ada")>0,"Sebagian","Lengkap")))');
    }
  }
}

function checkMissingDocuments() {
  const rows = getObjects_(APP_CONFIG.SHEETS.DATA_DOKUMEN);
  return rows.filter(function(r) {
    return String(r['Wajib/Tidak']) === 'Wajib' && String(r['Status Dokumen']) !== 'Lengkap';
  }).map(function(r) {
    return {
      idDokumen: r['ID Dokumen'],
      idPaket: r['ID Paket'],
      namaPaket: r['Nama Paket'],
      namaDokumen: r['Nama Dokumen'],
      statusDokumen: r['Status Dokumen'],
      linkFile: r['Link File']
    };
  });
}

/**
 * ValidationService.gs
 * Validasi input paket.
 */
function validatePackageData(data) {
  const errors = [];
  REQUIRED_PACKAGE_FIELDS.forEach(function(field) {
    if (data[field] === undefined || data[field] === null || String(data[field]).trim() === '') {
      errors.push('Field wajib belum diisi: ' + field);
    }
  });

  const pagu = toNumber_(data.paguAnggaran);
  const hps = toNumber_(data.nilaiHps);
  const kontrak = toNumber_(data.nilaiKontrak);

  if (isNaN(pagu) || pagu <= 0) errors.push('Pagu Anggaran harus angka lebih dari 0.');
  if (!isNaN(hps) && hps < 0) errors.push('Nilai HPS tidak boleh negatif.');
  if (!isNaN(kontrak) && kontrak < 0) errors.push('Nilai Kontrak/SPK tidak boleh negatif.');
  if (!isNaN(kontrak) && kontrak > pagu && !data.catatan) {
    errors.push('Nilai Kontrak/SPK lebih besar dari pagu. Isi catatan khusus jika memang valid.');
  }

  const budget = getBudgetByCode(data.akunBelanja);
  if (budget && !isNaN(kontrak) && kontrak > 0) {
    const paguAkhir = Number(budget['Pagu Akhir'] || 0);
    if (paguAkhir > 0 && kontrak > paguAkhir && !data.catatan) {
      errors.push('Nilai Kontrak/SPK lebih besar dari Pagu Akhir pada DATA_ANGGARAN. Isi catatan khusus jika memang valid.');
    }
  }

  const mulai = new Date(data.tanggalMulai);
  const selesai = new Date(data.tanggalSelesai);
  if (String(mulai) === 'Invalid Date') errors.push('Tanggal Mulai tidak valid.');
  if (String(selesai) === 'Invalid Date') errors.push('Tanggal Selesai tidak valid.');
  if (String(mulai) !== 'Invalid Date' && String(selesai) !== 'Invalid Date' && selesai < mulai) {
    errors.push('Tanggal Selesai tidak boleh lebih awal dari Tanggal Mulai.');
  }

  const master = getMasterData();
  validateInList_(errors, data.statusPengadaan || 'Draft', master.statusPengadaan, 'Status Pengadaan');
  validateInList_(errors, data.statusDokumen || 'Belum Ada', master.statusDokumen, 'Status Dokumen');
  validateInList_(errors, data.statusPembayaran || 'Belum Diajukan', master.statusPembayaran, 'Status Pembayaran');
  validateInList_(errors, data.metodePengadaan, master.metodePengadaan, 'Metode Pengadaan');

  return { valid: errors.length === 0, errors: errors };
}

function validateInList_(errors, value, list, label) {
  if (!list || list.length === 0) return;
  if (list.indexOf(value) === -1) errors.push(label + ' tidak sesuai master data: ' + value);
}

function toNumber_(value) {
  if (value === '' || value === null || value === undefined) return 0;
  if (typeof value === 'number') return value;
  return Number(String(value).replace(/\./g, '').replace(/,/g, '.'));
}

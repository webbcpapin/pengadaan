/**
 * BudgetService.gs
 * Sinkronisasi paket pengadaan dengan DATA_ANGGARAN.
 */
function syncPackageTotalsToBudget() {
  const budgetSheet = getSheet_(APP_CONFIG.SHEETS.DATA_ANGGARAN);
  const budgetMap = getHeaderMap_(budgetSheet);
  const paketTotals = calculatePackageTotalsByBudgetCode_();
  const lastRow = budgetSheet.getLastRow();
  if (lastRow < 2) return;
  const rows = budgetSheet.getRange(2, 1, lastRow - 1, budgetSheet.getLastColumn()).getValues();
  rows.forEach(function(row, i) {
    const code = String(row[budgetMap['Kode Akun'] - 1] || '').trim();
    const total = paketTotals[code] || 0;
    const rowNumber = i + 2;
    if (budgetMap['Total Paket PBJ']) budgetSheet.getRange(rowNumber, budgetMap['Total Paket PBJ']).setValue(total);
    if (budgetMap['Selisih Realisasi-PBJ']) budgetSheet.getRange(rowNumber, budgetMap['Selisih Realisasi-PBJ']).setFormula('=H' + rowNumber + '-L' + rowNumber);
    if (budgetMap['Sisa Anggaran']) budgetSheet.getRange(rowNumber, budgetMap['Sisa Anggaran']).setFormula('=F' + rowNumber + '-H' + rowNumber);
    if (budgetMap['% Realisasi']) budgetSheet.getRange(rowNumber, budgetMap['% Realisasi']).setFormula('=IFERROR(H' + rowNumber + '/F' + rowNumber + ',0)');
    if (budgetMap['Status Anggaran']) {
      budgetSheet.getRange(rowNumber, budgetMap['Status Anggaran']).setFormula('=IF(H' + rowNumber + '>F' + rowNumber + ',"Over Realisasi",IF(K' + rowNumber + '>=0.9,"Terserap >90%",IF(H' + rowNumber + '=0,"Belum Terserap","Berjalan")))');
    }
  });
  logActivity('SYNC_BUDGET', '', 'Total PBJ disinkronkan ke DATA_ANGGARAN');
}

function calculatePackageTotalsByBudgetCode_() {
  const paketSheet = getSheet_(APP_CONFIG.SHEETS.DATA_PAKET);
  const map = getHeaderMap_(paketSheet);
  const lastRow = paketSheet.getLastRow();
  const result = {};
  if (lastRow < 2) return result;
  const rows = paketSheet.getRange(2, 1, lastRow - 1, paketSheet.getLastColumn()).getValues();
  rows.forEach(function(row) {
    const code = String(row[map['Akun Belanja'] - 1] || '').trim();
    const nilai = Number(row[map['Nilai Kontrak/SPK'] - 1] || 0);
    if (!code) return;
    result[code] = (result[code] || 0) + nilai;
  });
  return result;
}

function getBudgetByCode(budgetCode) {
  const rows = getObjects_(APP_CONFIG.SHEETS.DATA_ANGGARAN);
  return rows.find(function(row) {
    return String(row['Kode Akun']).trim() === String(budgetCode).trim();
  }) || null;
}

function checkBudgetRisks() {
  syncPackageTotalsToBudget();
  const rows = getObjects_(APP_CONFIG.SHEETS.DATA_ANGGARAN);
  return rows.filter(function(row) {
    const pagu = Number(row['Pagu Akhir'] || 0);
    const realisasi = Number(row['Total Realisasi'] || 0);
    const pbj = Number(row['Total Paket PBJ'] || 0);
    return realisasi > pagu || pbj > pagu || String(row['Status Anggaran']).indexOf('Over') >= 0;
  }).map(function(row) {
    return {
      kodeAkun: row['Kode Akun'],
      uraian: row['Uraian Akun'],
      pagu: row['Pagu Akhir'],
      realisasi: row['Total Realisasi'],
      totalPbj: row['Total Paket PBJ'],
      status: row['Status Anggaran']
    };
  });
}

function showBudgetRisks() {
  const risks = checkBudgetRisks();
  const ui = SpreadsheetApp.getUi();
  if (!risks.length) {
    ui.alert('Cek Anggaran', 'Tidak ada akun yang melewati pagu berdasarkan data saat ini.', ui.ButtonSet.OK);
    return;
  }
  const text = risks.slice(0, 25).map(function(r) {
    return r.kodeAkun + ' | Pagu: ' + r.pagu + ' | Realisasi: ' + r.realisasi + ' | PBJ: ' + r.totalPbj + ' | ' + r.status;
  }).join('\n');
  ui.alert('Cek Anggaran', text, ui.ButtonSet.OK);
}

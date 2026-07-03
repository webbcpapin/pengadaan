/**
 * SheetService.gs
 * Utilitas dasar Google Sheet.
 */
function getSs_() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

function getSheet_(name) {
  const sh = getSs_().getSheetByName(name);
  if (!sh) throw new Error('Sheet tidak ditemukan: ' + name);
  return sh;
}

function getHeaderMap_(sheet) {
  const lastCol = sheet.getLastColumn();
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  const map = {};
  headers.forEach(function(h, i) {
    if (h) map[String(h).trim()] = i + 1;
  });
  return map;
}

function getObjects_(sheetName) {
  const sh = getSheet_(sheetName);
  const values = sh.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values.shift();
  return values.filter(function(r) {
    return r.some(function(c) { return c !== '' && c !== null; });
  }).map(function(row, idx) {
    const obj = { _row: idx + 2 };
    headers.forEach(function(h, c) {
      if (h) obj[String(h).trim()] = row[c];
    });
    return obj;
  });
}

function appendRowByHeaders_(sheetName, objectData) {
  const sh = getSheet_(sheetName);
  const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  const row = headers.map(function(h) {
    return Object.prototype.hasOwnProperty.call(objectData, h) ? objectData[h] : '';
  });
  sh.appendRow(row);
  return sh.getLastRow();
}

function updateRowByHeaders_(sheetName, rowNumber, objectData) {
  const sh = getSheet_(sheetName);
  const map = getHeaderMap_(sh);
  Object.keys(objectData).forEach(function(header) {
    if (map[header]) sh.getRange(rowNumber, map[header]).setValue(objectData[header]);
  });
}

function findRowByValue_(sheetName, headerName, value) {
  const sh = getSheet_(sheetName);
  const map = getHeaderMap_(sh);
  if (!map[headerName]) throw new Error('Kolom tidak ditemukan: ' + headerName);
  const col = map[headerName];
  const lastRow = sh.getLastRow();
  if (lastRow < 2) return null;
  const vals = sh.getRange(2, col, lastRow - 1, 1).getValues();
  for (var i = 0; i < vals.length; i++) {
    if (String(vals[i][0]).trim() === String(value).trim()) return i + 2;
  }
  return null;
}

function setDropdown_(sheetName, rangeA1, values) {
  const sh = getSheet_(sheetName);
  const rule = SpreadsheetApp.newDataValidation().requireValueInList(values, true).build();
  sh.getRange(rangeA1).setDataValidation(rule);
}

function formatDate_(value, pattern) {
  if (!value) return '';
  const d = value instanceof Date ? value : new Date(value);
  return Utilities.formatDate(d, APP_CONFIG.TIMEZONE, pattern || APP_CONFIG.DATE_FORMAT);
}

function now_() {
  return new Date();
}

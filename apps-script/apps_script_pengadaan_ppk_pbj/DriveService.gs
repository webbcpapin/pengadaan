/**
 * DriveService.gs
 * Pembuatan folder Google Drive per paket.
 */
function getRootFolder_() {
  if (!APP_CONFIG.ROOT_FOLDER_ID || APP_CONFIG.ROOT_FOLDER_ID === 'ISI_DENGAN_FOLDER_ID_GOOGLE_DRIVE') {
    throw new Error('ROOT_FOLDER_ID belum diisi di Config.gs.');
  }
  return DriveApp.getFolderById(APP_CONFIG.ROOT_FOLDER_ID);
}

function getOrCreateFolder_(parentFolder, folderName) {
  const it = parentFolder.getFoldersByName(folderName);
  if (it.hasNext()) return it.next();
  return parentFolder.createFolder(folderName);
}

function createPackageFolder(packageData) {
  const root = getRootFolder_();
  const year = String(packageData['Tahun Anggaran'] || packageData.tahunAnggaran || APP_CONFIG.DEFAULT_YEAR);
  const yearFolder = getOrCreateFolder_(root, 'Tahun ' + year);
  const safeName = sanitizeFolderName_(packageData['Nama Paket'] || packageData.namaPaket || 'Tanpa Nama');
  const code = packageData['Kode Paket'] || packageData.kodePaket || packageData.kodePaketGenerated;
  const folderName = code + ' - ' + safeName;
  const packageFolder = getOrCreateFolder_(yearFolder, folderName);
  createSubfolders(packageFolder);
  return packageFolder;
}

function createSubfolders(parentFolder) {
  APP_CONFIG.SUBFOLDERS.forEach(function(name) {
    getOrCreateFolder_(parentFolder, name);
  });
}

function sanitizeFolderName_(name) {
  return String(name)
    .replace(/[\\/:*?"<>|#%{}~&]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 120);
}

function updatePackageFolderLink(packageId, folderUrl) {
  const row = findRowByValue_(APP_CONFIG.SHEETS.DATA_PAKET, 'ID Paket', packageId);
  if (!row) throw new Error('ID Paket tidak ditemukan: ' + packageId);
  updateRowByHeaders_(APP_CONFIG.SHEETS.DATA_PAKET, row, {
    'Link Folder Drive': folderUrl,
    'Updated At': now_()
  });
}

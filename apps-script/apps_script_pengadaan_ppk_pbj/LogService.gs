/**
 * LogService.gs
 * Audit log sederhana.
 */
function logActivity(action, packageId, detail) {
  const email = Session.getActiveUser().getEmail() || 'unknown-user';
  let packageName = '';
  try {
    const pkg = packageId ? getPackageObjectById(packageId) : null;
    packageName = pkg ? pkg['Nama Paket'] : '';
  } catch (err) {
    packageName = '';
  }
  appendRowByHeaders_(APP_CONFIG.SHEETS.LOG, {
    'Timestamp': now_(),
    'User': email,
    'Aktivitas': action,
    'ID Paket': packageId || '',
    'Nama Paket': packageName || '',
    'Detail Perubahan': typeof detail === 'string' ? detail : JSON.stringify(detail)
  });
}

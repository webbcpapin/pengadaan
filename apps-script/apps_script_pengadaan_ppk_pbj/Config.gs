/**
 * Config.gs
 * Konfigurasi aplikasi pengadaan berbasis Google Sheet dan Google Drive.
 * Isi ROOT_FOLDER_ID sebelum menjalankan pembuatan folder paket.
 */
const APP_CONFIG = {
  APP_NAME: 'Aplikasi Pengadaan PPK dan PBJ',
  ROOT_FOLDER_ID: 'ISI_DENGAN_FOLDER_ID_GOOGLE_DRIVE',
  DEFAULT_YEAR: 2026,
  SATKER_NAME: 'KPPBC TMP C Pangkalpinang',
  KODE_SATKER: '636722',
  KODE_UNIT: 'KBC.0503',
  TIMEZONE: 'Asia/Jakarta',
  PACKAGE_CODE_FORMAT: 'PBJ-{TAHUN}-{AKUN}-{NNN}',
  PACKAGE_ID_PREFIX: 'PKT',
  DATE_FORMAT: 'yyyy-MM-dd',
  DATETIME_FORMAT: 'yyyy-MM-dd HH:mm:ss',
  SUBFOLDERS: [
    '01_Perencanaan',
    '02_Persiapan_Pengadaan',
    '03_Pemilihan',
    '04_Kontrak_SPK',
    '05_Pelaksanaan',
    '06_Serah_Terima',
    '07_Pembayaran',
    '08_Pajak',
    '09_Laporan',
    '10_Korespondensi'
  ],
  SHEETS: {
    DASHBOARD: 'DASHBOARD',
    DATA_PAKET: 'DATA_PAKET',
    DATA_PENYEDIA: 'DATA_PENYEDIA',
    DATA_DOKUMEN: 'DATA_DOKUMEN',
    CHECKLIST: 'CHECKLIST_ADMINISTRASI',
    DATA_ANGGARAN: 'DATA_ANGGARAN',
    POK_DETAIL: 'POK_DETAIL',
    RAW_PBJ: 'RAW_PBJ',
    RINGKASAN_AKUN: 'RINGKASAN_AKUN',
    LOG: 'LOG_AKTIVITAS',
    MASTER: 'MASTER_DATA',
    PENGATURAN: 'PENGATURAN',
    LAPORAN: 'LAPORAN_PAKET',
    NOMOR_REGISTER: 'NOMOR_REGISTER',
    TEMPLATE_MAP: 'TEMPLATE_MAP',
    ARSIP: 'ARSIP'
  },
  HEADERS: {
    DATA_PAKET: [
      'ID Paket','Kode Paket','Tahun Anggaran','Nama Paket','Unit/Seksi Pemohon',
      'Jenis Belanja','Akun Belanja','Metode Pengadaan','Jenis Kontrak','Pagu Anggaran',
      'Nilai HPS','Nilai Kontrak/SPK','Nama Penyedia','NPWP Penyedia','Tanggal Mulai',
      'Tanggal Selesai','Status Pengadaan','Status Dokumen','Status Pembayaran',
      'Link Folder Drive','PIC','Catatan','Created At','Updated At',
      'Hari Menuju Deadline','Risiko Administrasi','Perlu Tindak Lanjut'
    ],
    DATA_ANGGARAN: [
      'Tahun Anggaran','Kode Akun','Uraian Akun','Pagu Awal','Revisi Pagu','Pagu Akhir',
      'Total Kontrak','Total Realisasi','Sisa Anggaran','Catatan','% Realisasi',
      'Total Paket PBJ','Selisih Realisasi-PBJ','Status Anggaran','Sumber Data'
    ],
    DATA_DOKUMEN: [
      'ID Dokumen','ID Paket','Nama Paket','Tahap Dokumen','Nama Dokumen','Wajib/Tidak',
      'Status Dokumen','Tanggal Upload','Link File','Catatan','Perlu Revisi','Updated At'
    ],
    CHECKLIST: [
      'ID Paket','Nama Paket','KAK/TOR','RAB','HPS','Survey Harga','Nota Dinas Kebutuhan',
      'Undangan Penawaran','Penawaran Penyedia','Evaluasi/Klarifikasi','Negosiasi','Penetapan Penyedia',
      'SPK/Kontrak/Surat Pesanan','SPMK jika ada','Dokumentasi Pelaksanaan','BAST','BAPP jika ada',
      'Invoice/Tagihan','Kuitansi','Faktur Pajak jika ada','Dokumen Pajak','SPTJB','SPP/SPM/SP2D jika diperlukan',
      'Laporan Pelaksanaan','Status Lengkap','Catatan'
    ]
  }
};

const REQUIRED_PACKAGE_FIELDS = [
  'tahunAnggaran',
  'namaPaket',
  'unitSeksi',
  'jenisBelanja',
  'akunBelanja',
  'metodePengadaan',
  'jenisKontrak',
  'paguAnggaran',
  'tanggalMulai',
  'tanggalSelesai',
  'pic'
];

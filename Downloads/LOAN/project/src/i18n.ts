import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      'Item Catalog': 'Item Catalog',
      'My Loans': 'My Loans',
      'Manage Loans': 'Manage Loans',
      'Request': 'Request',
      'Active Loans': 'Active Loans',
      'Pending': 'Pending',
      'History': 'History',
      'Export Report': 'Export Report',
      'Reason': 'Reason',
      'Date': 'Date',
      'Time': 'Time',
      'Submit': 'Submit',
      'Cancel': 'Cancel',
      'Extend': 'Extend',
      'Return': 'Return',
      'Overdue': 'Overdue',
      'Active': 'Active',
      'Notes': 'Notes',
      'Quantity': 'Quantity',
      'Due': 'Due',
      'Requested': 'Requested',
      'Search': 'Search',
      'Filters': 'Filters',
      'All Categories': 'All Categories',
      'All Conditions': 'All Conditions',
      'Excellent': 'Excellent',
      'Good': 'Good',
      'Fair': 'Fair',
      'Poor': 'Poor',
      'Sort by': 'Sort by',
      'Name': 'Name',
      'Category': 'Category',
      'Condition': 'Condition',
      'Availability': 'Availability',
      'Value': 'Value',
      'No items found': 'No items found',
      'Try adjusting your search criteria or filters': 'Try adjusting your search criteria or filters',
    }
  },
  id: {
    translation: {
      'Item Catalog': 'Katalog Barang',
      'My Loans': 'Pinjaman Saya',
      'Manage Loans': 'Kelola Pinjaman',
      'Request': 'Ajukan',
      'Active Loans': 'Pinjaman Aktif',
      'Pending': 'Menunggu',
      'History': 'Riwayat',
      'Export Report': 'Ekspor Laporan',
      'Reason': 'Alasan',
      'Date': 'Tanggal',
      'Time': 'Jam',
      'Submit': 'Kirim',
      'Cancel': 'Batal',
      'Extend': 'Perpanjang',
      'Return': 'Kembalikan',
      'Overdue': 'Terlambat',
      'Active': 'Aktif',
      'Notes': 'Catatan',
      'Quantity': 'Jumlah',
      'Due': 'Jatuh Tempo',
      'Requested': 'Diajukan',
      'Search': 'Cari',
      'Filters': 'Filter',
      'All Categories': 'Semua Kategori',
      'All Conditions': 'Semua Kondisi',
      'Excellent': 'Sangat Baik',
      'Good': 'Baik',
      'Fair': 'Cukup',
      'Poor': 'Kurang',
      'Sort by': 'Urutkan',
      'Name': 'Nama',
      'Category': 'Kategori',
      'Condition': 'Kondisi',
      'Availability': 'Ketersediaan',
      'Value': 'Nilai',
      'No items found': 'Tidak ada barang ditemukan',
      'Try adjusting your search criteria or filters': 'Coba ubah kriteria pencarian atau filter',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'id',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 
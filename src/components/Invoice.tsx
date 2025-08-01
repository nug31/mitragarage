import React from 'react';
import { X, Download, Printer, Calendar, User, Car, Wrench, Phone, MapPin, Clock } from 'lucide-react';

interface InvoiceProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: any;
}

const Invoice: React.FC<InvoiceProps> = ({ isOpen, onClose, bookingData }) => {
  if (!isOpen || !bookingData) return null;

  const currentDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const currentTime = new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const invoiceNumber = `INV-${bookingData.id}-${new Date().getFullYear()}`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a comprehensive text version for download
    const invoiceText = `
INVOICE BOOKING SERVIS - MITRA GARAGE
=====================================
Sistem Manajemen Bengkel Terpercaya

No. Invoice: ${invoiceNumber}
Tanggal: ${currentDate}
Waktu: ${currentTime}
Status: ${bookingData.status || 'Menunggu'}

INFORMASI PELANGGAN:
- Nama: ${bookingData.customerName || bookingData.customer_name}
- Telepon: ${bookingData.phoneNumber || bookingData.customer_phone || bookingData.phone}
${(bookingData.customer_email || bookingData.email) ? `- Email: ${bookingData.customer_email || bookingData.email}` : ''}

INFORMASI KENDARAAN:
- Nomor Kendaraan: ${bookingData.vehicleNumber || bookingData.vehicle_number}
- Jenis Kendaraan: ${bookingData.vehicleType || bookingData.vehicle_type}
${(bookingData.vehicleKilometer || bookingData.vehicle_kilometer) ? `- KM Kendaraan: ${bookingData.vehicleKilometer || bookingData.vehicle_kilometer} km` : ''}
- Tahun: ${bookingData.vehicleYear || bookingData.vehicle_year || '-'}
- Warna: ${bookingData.vehicleColor || bookingData.vehicle_color || '-'}

DETAIL LAYANAN:
- Jenis Layanan: ${bookingData.serviceType || bookingData.service_type}
- Kategori: ${bookingData.serviceCategory || 'Perawatan Rutin'}
- Tanggal Booking: ${bookingData.preferredDate || bookingData.booking_date}
- Waktu Booking: ${bookingData.preferredTime || bookingData.booking_time}
- Estimasi Biaya: ${bookingData.estimatedCost || bookingData.estimated_cost || 'Akan dihitung'}
- Estimasi Waktu: ${bookingData.estimatedDuration || bookingData.estimated_duration || '1-2 jam'}
- Prioritas: ${bookingData.priority || 'Normal'}
- Teknisi: ${bookingData.technician || 'Akan ditentukan'}

RINCIAN BIAYA:
- Layanan: ${bookingData.serviceType || bookingData.service_type} x 1
- Harga: ${bookingData.estimatedCost || bookingData.estimated_cost || 'Akan dihitung'}
- Total Estimasi: ${bookingData.estimatedCost || bookingData.estimated_cost || 'Akan dihitung'}
* Biaya final dapat berbeda setelah pemeriksaan detail kendaraan

CATATAN/KELUHAN:
${bookingData.description || bookingData.notes || 'Tidak ada catatan khusus'}

SYARAT & KETENTUAN:
• Pembayaran dilakukan setelah pekerjaan selesai
• Garansi layanan berlaku 30 hari atau 1000 km (mana yang lebih dulu)
• Barang yang ditinggal lebih dari 30 hari dianggap tidak diambil
• Mitra Garage tidak bertanggung jawab atas barang berharga di dalam kendaraan
• Estimasi waktu dapat berubah tergantung kondisi kendaraan
• Untuk keluhan, hubungi customer service dalam 24 jam

KONTAK INFORMASI:
Alamat: Jl. Raya Garage No. 123, Jakarta
Telepon: (021) 1234-5678
Emergency: (021) 1234-5679
WhatsApp: +62 812-3456-7890
Email: info@mitragarage.com
Support: support@mitragarage.com

JAM OPERASIONAL:
Senin - Jumat: 08:00 - 17:00
Sabtu: 08:00 - 15:00
Minggu: Tutup
Emergency: 24/7

=====================================
Terima kasih telah mempercayakan kendaraan Anda kepada Mitra Garage!
Invoice ini dibuat secara otomatis oleh sistem dan sah tanpa tanda tangan.
    `;

    const blob = new Blob([invoiceText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice-${invoiceNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 print:hidden">
          <h2 className="text-2xl font-bold text-gray-800">Invoice Booking</h2>
          <div className="flex space-x-2">
            <button
              onClick={handleDownload}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="p-8 print:p-4">
          {/* Company Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">MITRA GARAGE</h1>
            <p className="text-gray-600">Sistem Manajemen Bengkel Terpercaya</p>
            <div className="flex justify-center items-center space-x-4 mt-2 text-sm text-gray-500">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                Jl. Raya Garage No. 123, Jakarta
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-1" />
                (021) 1234-5678
              </div>
            </div>
          </div>

          {/* Invoice Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Informasi Invoice</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">No. Invoice:</span>
                  <span className="font-medium">{invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tanggal:</span>
                  <span className="font-medium">{currentDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Waktu:</span>
                  <span className="font-medium">{currentTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    bookingData.status === 'Selesai' ? 'bg-green-100 text-green-800' :
                    bookingData.status === 'Sedang Dikerjakan' ? 'bg-blue-100 text-blue-800' :
                    bookingData.status === 'Menunggu' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {bookingData.status || 'Menunggu'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Informasi Pelanggan</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium">{bookingData.customerName || bookingData.customer_name}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{bookingData.phoneNumber || bookingData.customer_phone || bookingData.phone}</span>
                </div>
                {(bookingData.customer_email || bookingData.email) && (
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-2">@</span>
                    <span>{bookingData.customer_email || bookingData.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Vehicle & Service Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Informasi Kendaraan</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <Car className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium">{bookingData.vehicleNumber || bookingData.vehicle_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Jenis:</span>
                  <span>{bookingData.vehicleType || bookingData.vehicle_type}</span>
                </div>
                {(bookingData.vehicleKilometer || bookingData.vehicle_kilometer) && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">KM:</span>
                    <span>{(bookingData.vehicleKilometer || bookingData.vehicle_kilometer)} km</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Tahun:</span>
                  <span>{bookingData.vehicleYear || bookingData.vehicle_year || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Warna:</span>
                  <span>{bookingData.vehicleColor || bookingData.vehicle_color || '-'}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Informasi Layanan</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <Wrench className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium">{bookingData.serviceType || bookingData.service_type}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{bookingData.preferredDate || bookingData.booking_date}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{bookingData.preferredTime || bookingData.booking_time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimasi Biaya:</span>
                  <span className="font-medium text-green-600">
                    {bookingData.estimatedCost || bookingData.estimated_cost || 'Akan dihitung'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimasi Waktu:</span>
                  <span>{bookingData.estimatedDuration || bookingData.estimated_duration || '1-2 jam'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Detail Layanan</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Jenis Layanan:</span>
                  <p className="font-medium">{bookingData.serviceType || bookingData.service_type}</p>
                </div>
                <div>
                  <span className="text-gray-600">Kategori:</span>
                  <p className="font-medium">{bookingData.serviceCategory || 'Perawatan Rutin'}</p>
                </div>
                <div>
                  <span className="text-gray-600">Prioritas:</span>
                  <p className="font-medium">{bookingData.priority || 'Normal'}</p>
                </div>
                <div>
                  <span className="text-gray-600">Teknisi:</span>
                  <p className="font-medium">{bookingData.technician || 'Akan ditentukan'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {(bookingData.description || bookingData.notes) && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Catatan/Keluhan</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">{bookingData.description || bookingData.notes}</p>
              </div>
            </div>
          )}

          {/* Cost Breakdown */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Rincian Biaya</h3>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Layanan
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Qty
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Harga
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {bookingData.serviceType || bookingData.service_type}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">1</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {bookingData.estimatedCost || bookingData.estimated_cost || 'Akan dihitung'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {bookingData.estimatedCost || bookingData.estimated_cost || 'Akan dihitung'}
                    </td>
                  </tr>
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                      Total Estimasi:
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-green-600">
                      {bookingData.estimatedCost || bookingData.estimated_cost || 'Akan dihitung'}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              * Biaya final dapat berbeda setelah pemeriksaan detail kendaraan
            </p>
          </div>

          {/* Terms & Conditions */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Syarat & Ketentuan</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Pembayaran dilakukan setelah pekerjaan selesai</li>
                <li>• Garansi layanan berlaku 30 hari atau 1000 km (mana yang lebih dulu)</li>
                <li>• Barang yang ditinggal lebih dari 30 hari dianggap tidak diambil</li>
                <li>• Mitra Garage tidak bertanggung jawab atas barang berharga di dalam kendaraan</li>
                <li>• Estimasi waktu dapat berubah tergantung kondisi kendaraan</li>
                <li>• Untuk keluhan, hubungi customer service dalam 24 jam</li>
              </ul>
            </div>
          </div>

          {/* Contact & Emergency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Kontak Darurat</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-red-500" />
                  <span>Emergency: (021) 1234-5679</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-2">📱</span>
                  <span>WhatsApp: +62 812-3456-7890</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-2">@</span>
                  <span>Email: support@mitragarage.com</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Jam Operasional</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Senin - Jumat:</span>
                  <span>08:00 - 17:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sabtu:</span>
                  <span>08:00 - 15:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Minggu:</span>
                  <span className="text-red-500">Tutup</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Emergency:</span>
                  <span className="text-green-600">24/7</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-6 mt-8">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Terima kasih telah mempercayakan kendaraan Anda kepada <strong>Mitra Garage</strong>
              </p>
              <p className="text-xs text-gray-500 mb-2">
                Invoice ini dibuat secara otomatis oleh sistem dan sah tanpa tanda tangan
              </p>
              <div className="flex justify-center items-center space-x-4 text-xs text-gray-400">
                <span>🔒 Secure</span>
                <span>•</span>
                <span>📱 Digital</span>
                <span>•</span>
                <span>🌱 Eco-Friendly</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;

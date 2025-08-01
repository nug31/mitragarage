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
    // Create a simple text version for download
    const invoiceText = `
INVOICE BOOKING SERVIS - MITRA GARAGE
=====================================

No. Invoice: ${invoiceNumber}
Tanggal: ${currentDate}
Waktu: ${currentTime}

INFORMASI PELANGGAN:
- Nama: ${bookingData.customerName}
- Telepon: ${bookingData.phoneNumber}

INFORMASI KENDARAAN:
- Nomor Kendaraan: ${bookingData.vehicleNumber}
- Jenis Kendaraan: ${bookingData.vehicleType}
${bookingData.vehicleKilometer ? `- KM Kendaraan: ${bookingData.vehicleKilometer}` : ''}

LAYANAN:
- Jenis Layanan: ${bookingData.serviceType}
- Tanggal Booking: ${bookingData.preferredDate}
- Waktu Booking: ${bookingData.preferredTime}
- Status: ${bookingData.status}

CATATAN:
${bookingData.description || 'Tidak ada catatan khusus'}

=====================================
Terima kasih telah mempercayakan kendaraan Anda kepada Mitra Garage!

Alamat: Jl. Raya Garage No. 123, Jakarta
Telepon: (021) 1234-5678
Email: info@mitragarage.com
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
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                    {bookingData.status}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Informasi Pelanggan</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium">{bookingData.customerName}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{bookingData.phoneNumber}</span>
                </div>
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
                  <span className="font-medium">{bookingData.vehicleNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Jenis:</span>
                  <span>{bookingData.vehicleType}</span>
                </div>
                {bookingData.vehicleKilometer && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">KM:</span>
                    <span>{bookingData.vehicleKilometer} km</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Informasi Layanan</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <Wrench className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium">{bookingData.serviceType}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{bookingData.preferredDate}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{bookingData.preferredTime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {bookingData.description && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Catatan/Keluhan</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">{bookingData.description}</p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-gray-200 pt-6 mt-8">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Terima kasih telah mempercayakan kendaraan Anda kepada <strong>Mitra Garage</strong>
              </p>
              <p className="text-xs text-gray-500">
                Invoice ini dibuat secara otomatis oleh sistem dan sah tanpa tanda tangan
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;

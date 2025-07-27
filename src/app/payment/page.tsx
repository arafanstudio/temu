
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, ArrowLeft, Upload, Check, CreditCard, Smartphone, AlertCircle } from 'lucide-react'

export default function PaymentPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadedFile(file)
    setUploadError("")
  }

  const handleUploadButtonClick = async () => {
    if (!uploadedFile) return;

    setUploading(true)
    setUploadError("")

    try {
      const formData = new FormData()
      formData.append("file", uploadedFile)

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const uploadResult = await uploadResponse.json()

      if (uploadResult.success) {
        // Now save the payment record to the database
        const coupleId = localStorage.getItem("currentCoupleId"); // Retrieve coupleId
        if (!coupleId) {
          setUploadError("Couple ID not found. Please create an invitation first.");
          return;
        }

        const paymentData = {
          couple_id: coupleId,
          amount: 50000, // Assuming a fixed amount for now
          proof_image_url: uploadResult.url,
          status: "pending",
        };

        const savePaymentResponse = await fetch("/api/payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentData),
        });

        const savePaymentResult = await savePaymentResponse.json();

        if (savePaymentResult.success) {
          setUploadSuccess(true)
          console.log("Payment record saved successfully:", savePaymentResult.paymentId)
          localStorage.removeItem("currentCoupleId"); // Clear coupleId after successful payment
        } else {
          setUploadError(savePaymentResult.error || "Failed to save payment record.");
        }
      } else {
        setUploadError(uploadResult.error || "Upload failed")
      }
    } catch (error) {
      console.error("Error during file upload or payment save:", error);
      setUploadError("Network error occurred or failed to save payment.");
    } finally {
      setUploading(false)
    }
  }

  const bankAccounts = [
    {
      bank: 'Bank BCA',
      accountNumber: '1234567890',
      accountName: 'PT Temu Digital'
    },
    {
      bank: 'Bank Mandiri',
      accountNumber: '0987654321',
      accountName: 'PT Temu Digital'
    },
    {
      bank: 'Bank BNI',
      accountNumber: '5555666677',
      accountName: 'PT Temu Digital'
    }
  ]

  if (uploadSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-10 w-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Pembayaran Berhasil Dikirim!
          </h2>
          <p className="text-gray-600 mb-6">
            Bukti transfer Anda telah diterima. Tim kami akan memverifikasi pembayaran dalam 1x24 jam.
            Anda akan menerima notifikasi setelah pembayaran diverifikasi.
          </p>
          <div className="space-y-3">
            <Link
              href="/"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 inline-block"
            >
              Kembali ke Beranda
            </Link>
            <Link
              href="/create"
              className="w-full border-2 border-pink-500 text-pink-500 py-3 rounded-full font-semibold hover:bg-pink-500 hover:text-white transition-all duration-200 inline-block"
            >
              Buat Undangan Lain
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/create" className="flex items-center space-x-2 text-gray-600 hover:text-pink-500 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>Kembali</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-pink-500" />
            <h1 className="text-2xl font-bold text-gray-800">Temu</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Pembayaran
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                {' '}Undangan
              </span>
            </h2>
            <p className="text-gray-600">
              Selesaikan pembayaran untuk mengaktifkan undangan pernikahan Anda
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Payment Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <CreditCard className="h-6 w-6 text-pink-500 mr-2" />
                Informasi Pembayaran
              </h3>

              {/* Price */}
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl p-6 mb-6">
                <div className="text-center">
                  <p className="text-pink-100 mb-2">Total Pembayaran</p>
                  <p className="text-3xl font-bold">Rp 50.000</p>
                  <p className="text-pink-100 text-sm">Sekali bayar, selamanya</p>
                </div>
              </div>

              {/* Bank Accounts */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800">Transfer ke Rekening:</h4>
                {bankAccounts.map((account, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800">{account.bank}</p>
                        <p className="text-lg font-mono text-gray-600">{account.accountNumber}</p>
                        <p className="text-sm text-gray-500">{account.accountName}</p>
                      </div>
                      <button
                        onClick={() => navigator.clipboard.writeText(account.accountNumber)}
                        className="text-pink-500 hover:text-pink-700 text-sm font-medium"
                      >
                        Salin
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* QRIS */}
              <div className="mt-6 p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Smartphone className="h-5 w-5 text-pink-500 mr-2" />
                  Atau Bayar dengan QRIS
                </h4>
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <div className="w-48 h-48 bg-white rounded-lg mx-auto flex items-center justify-center border-2 border-dashed border-gray-300">
                    <p className="text-gray-500">QR Code QRIS</p>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Scan QR code dengan aplikasi mobile banking atau e-wallet
                  </p>
                </div>
              </div>
            </div>

            {/* Upload Proof */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <Upload className="h-6 w-6 text-pink-500 mr-2" />
                Upload Bukti Transfer
              </h3>

              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div className="text-sm text-blue-700">
                      <p className="font-medium mb-1">Petunjuk Upload:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Upload screenshot atau foto bukti transfer</li>
                        <li>Pastikan nominal dan tanggal terlihat jelas</li>
                        <li>Format file: JPG, PNG, atau WebP</li>
                        <li>Maksimal ukuran file: 5MB</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* File Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-pink-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="file-upload"
                    className={`cursor-pointer ${uploading ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      {uploading ? 'Mengupload...' : 'Klik untuk upload bukti transfer'}
                    </p>
                    <p className="text-sm text-gray-500">
                      atau drag & drop file di sini
                    </p>
                  </label>
                </div>

                {/* Upload Status */}
                {uploadedFile && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">File terpilih:</p>
                    <p className="font-medium text-gray-800">{uploadedFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}

                {uploadError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700 text-sm">{uploadError}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  onClick={handleUploadButtonClick}
                  disabled={!uploadedFile || uploading}
                  className={`w-full py-3 rounded-full font-semibold transition-all duration-200 ${
                    uploadedFile && !uploading
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg transform hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {uploading ? 'Mengirim...' : 'Kirim Bukti Transfer'}
                </button>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Butuh Bantuan?
            </h3>
            <p className="text-gray-600 mb-4">
              Jika mengalami kesulitan dalam proses pembayaran, silakan hubungi customer service kami
            </p>
            <div className="flex justify-center space-x-4">
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-600 transition-colors"
              >
                WhatsApp
              </a>
              <a
                href="mailto:support@temu.com"
                className="border-2 border-gray-300 text-gray-600 px-6 py-2 rounded-full font-semibold hover:border-gray-400 transition-colors"
              >
                Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



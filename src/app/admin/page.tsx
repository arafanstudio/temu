'use client'

import { useState, useEffect } from 'react'
import { Heart, Check, X, Eye, Users, CreditCard, Calendar, MapPin, User, Trash2, Link as LinkIcon, Copy, Image } from 'lucide-react'
import { Couple, Payment, Guest } from '@/types'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [couples, setCouples] = useState<Couple[]>([])
  const [pendingPayments, setPendingPayments] = useState<Payment[]>([])
  const [selectedTab, setSelectedTab] = useState('pending')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [expandedCoupleId, setExpandedCoupleId] = useState<string | null>(null);
  const [coupleGuests, setCoupleGuests] = useState<{ [key: string]: Guest[] }>({});
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  // Load data from database when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadData()
    }
  }, [isAuthenticated])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Fetch couples data
      const couplesResponse = await fetch('/api/admin/couples')
      const couplesData = await couplesResponse.json()
      
      if (couplesData.success) {
        setCouples(couplesData.data || [])
      }

      // Fetch pending payments
      const paymentsResponse = await fetch('/api/admin/payments?status=pending')
      const paymentsData = await paymentsResponse.json()
      
      if (paymentsData.success) {
        setPendingPayments(paymentsData.data || [])
      }

    } catch (err) {
      console.error('Error loading data:', err)
      setError('Gagal memuat data dari database')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = () => {
    if (password === 'admin123') {
      setIsAuthenticated(true)
    } else {
      alert('Password salah!')
    }
  }

  const handleVerifyPayment = async (paymentId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/payments/${paymentId}/verify`, {
        method: 'POST'
      })
      const result = await response.json()
      
      if (result.success) {
        alert('Pembayaran berhasil diverifikasi!')
        await loadData() // Reload data
      } else {
        alert('Gagal memverifikasi pembayaran: ' + result.error)
      }
    } catch (err) {
      console.error('Error verifying payment:', err)
      alert('Gagal memverifikasi pembayaran')
    } finally {
      setLoading(false)
    }
  }

  const handleRejectPayment = async (paymentId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/payments/${paymentId}/reject`, {
        method: 'POST'
      })
      const result = await response.json()
      
      if (result.success) {
        alert('Pembayaran berhasil ditolak')
        await loadData() // Reload data
      } else {
        alert('Gagal menolak pembayaran: ' + result.error)
      }
    } catch (err) {
      console.error('Error rejecting payment:', err)
      alert('Gagal menolak pembayaran')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCouple = async (coupleId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus undangan ini?')) {
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/couples/${coupleId}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (result.success) {
        alert('Undangan berhasil dihapus!');
        await loadData(); // Reload data
      } else {
        alert('Gagal menghapus undangan: ' + result.error);
      }
    } catch (err) {
      console.error('Error deleting couple:', err);
      alert('Gagal menghapus undangan');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleGuests = async (coupleId: string, coupleSlug: string) => {
    if (expandedCoupleId === coupleId) {
      setExpandedCoupleId(null);
    } else {
      setExpandedCoupleId(coupleId);
      if (!coupleGuests[coupleId]) {
        try {
          setLoading(true);
          const response = await fetch(`/api/admin/couples/${coupleId}/guests`);
          const result = await response.json();
          if (result.success) {
            setCoupleGuests(prev => ({ ...prev, [coupleId]: result.data }));
          } else {
            console.error('Failed to fetch guests:', result.error);
            alert('Gagal memuat daftar tamu: ' + result.error);
          }
        } catch (err) {
          console.error('Error fetching guests:', err);
          alert('Gagal memuat daftar tamu.');
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    alert('Link berhasil disalin!');
  };

  const handleImagePreview = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
  };

  const closeImagePreview = () => {
    setSelectedImageUrl(null);
  };

  // Calculate statistics from real data
  const activeCouples = couples.filter(couple => couple.is_active && couple.payment_verified)
  const totalRevenue = activeCouples.length * 50000

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <Heart className="h-12 w-12 text-pink-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
            <p className="text-gray-600">Masukkan password untuk mengakses</p>
          </div>
          
          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password admin"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
            >
              Masuk
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-pink-500" />
              <h1 className="text-2xl font-bold text-gray-800">Temu Admin</h1>
            </div>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="text-gray-600 hover:text-red-500 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Pasangan</p>
                <p className="text-2xl font-bold text-gray-800">{couples.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <CreditCard className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Pending Verifikasi</p>
                <p className="text-2xl font-bold text-gray-800">{pendingPayments.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Undangan Aktif</p>
                <p className="text-2xl font-bold text-gray-800">{activeCouples.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Heart className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-800">
                  Rp {totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setSelectedTab('pending')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'pending'
                    ? 'border-pink-500 text-pink-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Pending Verifikasi ({pendingPayments.length})
              </button>
              <button
                onClick={() => setSelectedTab('active')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'active'
                    ? 'border-pink-500 text-pink-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Undangan Aktif ({activeCouples.length})
              </button>
            </nav>
          </div>

          {/* Table Content */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Memuat data...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              </div>
            ) : (
              <>
                {selectedTab === 'pending' && (
                  <div className="space-y-4">
                    {pendingPayments.length === 0 ? (
                      <div className="text-center py-8">
                        <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Tidak ada pembayaran yang perlu diverifikasi</p>
                      </div>
                    ) : (
                      pendingPayments.map((payment) => (
                        <div key={payment.id} className="border rounded-lg p-6 bg-gray-50">
                          <div className="grid md:grid-cols-3 gap-6">
                            {/* Payment Info */}
                            <div className="md:col-span-1">
                              <h3 className="font-semibold text-gray-800 mb-2">
                                {payment.couples?.groom_name} & {payment.couples?.bride_name}
                              </h3>
                              <div className="space-y-1 text-sm text-gray-600">
                                <p>💰 Jumlah: Rp {payment.amount?.toLocaleString()}</p>
                                <p>📅 Tanggal: {new Date(payment.created_at).toLocaleDateString('id-ID')}</p>
                                <p>⏰ Waktu: {new Date(payment.created_at).toLocaleTimeString('id-ID')}</p>
                              </div>
                            </div>

                            {/* Payment Proof Image */}
                            <div className="md:col-span-1">
                              <h4 className="font-medium text-gray-700 mb-2">Bukti Transfer:</h4>
                              {payment.proof_image_url ? (
                                <div className="space-y-2">
                                  <div 
                                    className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                                    onClick={() => handleImagePreview(payment.proof_image_url)}
                                  >
                                    <img
                                      src={payment.proof_image_url}
                                      alt="Bukti Transfer"
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkdhZ2FsIE1lbXVhdCBHYW1iYXI8L3RleHQ+PC9zdmc+';
                                      }}
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                                      <Eye className="h-8 w-8 text-white opacity-0 hover:opacity-100 transition-opacity" />
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleImagePreview(payment.proof_image_url)}
                                    className="w-full bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200 transition-colors flex items-center justify-center"
                                  >
                                    <Image className="h-4 w-4 mr-2" />
                                    Lihat Gambar Penuh
                                  </button>
                                </div>
                              ) : (
                                <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                                  <div className="text-center text-gray-500">
                                    <Image className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">Tidak ada bukti transfer</p>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="md:col-span-1 flex flex-col justify-center space-y-3">
                              <button
                                onClick={() => handleVerifyPayment(payment.id)}
                                className="bg-green-500 text-white px-4 py-3 rounded-lg text-sm hover:bg-green-600 transition-colors flex items-center justify-center"
                                disabled={loading}
                              >
                                <Check className="h-4 w-4 mr-2" />
                                Verifikasi Pembayaran
                              </button>
                              <button
                                onClick={() => handleRejectPayment(payment.id)}
                                className="bg-red-500 text-white px-4 py-3 rounded-lg text-sm hover:bg-red-600 transition-colors flex items-center justify-center"
                                disabled={loading}
                              >
                                <X className="h-4 w-4 mr-2" />
                                Tolak Pembayaran
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {selectedTab === 'active' && (
                  <div className="space-y-4">
                    {activeCouples.length === 0 ? (
                      <div className="text-center py-8">
                        <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Belum ada undangan yang aktif</p>
                      </div>
                    ) : (
                      activeCouples.map((couple) => (
                        <div key={couple.id} className="border rounded-lg p-4 bg-gray-50">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-800">
                                {couple.groom_name} & {couple.bride_name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                📅 {new Date(couple.event_date).toLocaleDateString('id-ID')} - {couple.event_time}
                              </p>
                              <p className="text-sm text-gray-600">
                                📍 {couple.event_location}
                              </p>
                              <p className="text-sm text-gray-600">
                                🔗 /{couple.slug}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                                Aktif
                              </span>
                              <button
                                onClick={() => handleDeleteCouple(couple.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 flex items-center"
                              >
                                <Trash2 className="h-4 w-4 mr-1" /> Hapus
                              </button>
                              <button
                                onClick={() => handleToggleGuests(couple.id, couple.slug)}
                                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 flex items-center"
                              >
                                {expandedCoupleId === couple.id ? 'Sembunyikan Tamu' : 'Lihat Tamu'} <Eye className="h-4 w-4 ml-1" />
                              </button>
                            </div>
                          </div>
                          {expandedCoupleId === couple.id && coupleGuests[couple.id] && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <h4 className="font-semibold text-gray-700 mb-2">Link Undangan Tamu:</h4>
                              {coupleGuests[couple.id].length === 0 ? (
                                <p className="text-sm text-gray-500">Tidak ada tamu terdaftar.</p>
                              ) : (
                                <div className="space-y-2">
                                  {coupleGuests[couple.id].map((guest) => (
                                    <div key={guest.id} className="flex items-center justify-between bg-white p-3 rounded border">
                                      <div>
                                        <span className="font-medium text-gray-800">{guest.name}</span>
                                        <p className="text-sm text-gray-600">/{couple.slug}/{guest.slug}</p>
                                      </div>
                                      <div className="flex space-x-2">
                                        <a
                                          href={`/${couple.slug}/${guest.slug}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-200 flex items-center"
                                        >
                                          <Eye className="h-4 w-4 mr-1" /> Lihat
                                        </a>
                                        <button
                                          onClick={() => handleCopyLink(`${window.location.origin}/${couple.slug}/${guest.slug}`)}
                                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 flex items-center"
                                        >
                                          <Copy className="h-4 w-4 mr-1" /> Salin
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Status Database */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center">
            <Users className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <h3 className="font-semibold text-blue-800">Status Database</h3>
              <p className="text-blue-600 text-sm">Admin panel terhubung dengan database. Data real-time dari Supabase.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {selectedImageUrl && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closeImagePreview}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeImagePreview}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="h-8 w-8" />
            </button>
            <img
              src={selectedImageUrl}
              alt="Preview Bukti Transfer"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  )
}


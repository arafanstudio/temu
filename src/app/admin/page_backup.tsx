'use client'

import { useState, useEffect } from 'react'
import { Heart, Check, X, Eye, Users, CreditCard, Calendar, MapPin, User } from 'lucide-react'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [couples, setCouples] = useState<any[]>([])
  const [pendingPayments, setPendingPayments] = useState<any[]>([])
  const [selectedTab, setSelectedTab] = useState('pending')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
                        <div key={payment.id} className="border rounded-lg p-4 bg-gray-50">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-800">
                                {payment.couple?.groom_name} & {payment.couple?.bride_name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Jumlah: Rp {payment.amount?.toLocaleString()}
                              </p>
                              <p className="text-sm text-gray-600">
                                Tanggal: {new Date(payment.created_at).toLocaleDateString('id-ID')}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleVerifyPayment(payment.id)}
                                className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                              >
                                ✓ Verifikasi
                              </button>
                              <button
                                onClick={() => handleRejectPayment(payment.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                              >
                                ✗ Tolak
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
                            <div className="text-right">
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                                Aktif
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Database Status */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-blue-900">Status Database</h3>
              <p className="text-sm text-blue-700">
                Admin panel terhubung dengan database. Data real-time dari Supabase.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

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
                        <p className="text-sm text-gray-400 mt-2">
                          Database belum memiliki data test. Silakan buat undangan untuk testing.
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-500">Data pembayaran pending akan muncul di sini</p>
                    )}
                  </div>
                )}

                {selectedTab === 'active' && (
                  <div className="space-y-4">
                    {activeCouples.length === 0 ? (
                      <div className="text-center py-8">
                        <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Belum ada undangan yang aktif</p>
                        <p className="text-sm text-gray-400 mt-2">
                          Database belum memiliki data test. Silakan buat undangan untuk testing.
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-500">Data undangan aktif akan muncul di sini</p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Database Status */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-blue-900">Status Database</h3>
              <p className="text-sm text-blue-700">
                Admin panel berhasil dimuat. Database siap menerima data dari user yang membuat undangan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


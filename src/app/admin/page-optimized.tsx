'use client'

import { useState, useMemo } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Heart, Check, X, Eye, Users, CreditCard, Calendar, MapPin, User, Trash2, Link as LinkIcon, Copy, Image } from 'lucide-react'
import { Couple, Payment, Guest } from '@/types'
import { 
  useCouples, 
  usePendingPayments, 
  useCoupleGuests, 
  useVerifyPayment, 
  useRejectPayment, 
  useDeleteCouple 
} from '@/hooks/useOptimizedData'
import LazyImage from '@/components/LazyImage'
import VirtualizedList from '@/components/VirtualizedList'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function AdminPageContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [selectedTab, setSelectedTab] = useState('pending')
  const [expandedCoupleId, setExpandedCoupleId] = useState<string | null>(null)
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Use optimized hooks
  const { data: couples = [], isLoading: couplesLoading, error: couplesError } = useCouples()
  const { data: pendingPayments = [], isLoading: paymentsLoading, error: paymentsError } = usePendingPayments()
  
  // Mutations
  const verifyPaymentMutation = useVerifyPayment()
  const rejectPaymentMutation = useRejectPayment()
  const deleteCoupleMutation = useDeleteCouple()

  // Filtered and computed data
  const filteredCouples = useMemo(() => {
    if (!searchTerm) return couples
    return couples.filter(couple => 
      couple.groom_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      couple.bride_name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [couples, searchTerm])

  const activeCouples = useMemo(() => 
    filteredCouples.filter(couple => couple.is_active && couple.payment_verified),
    [filteredCouples]
  )

  const totalRevenue = useMemo(() => 
    activeCouples.length * 50000,
    [activeCouples.length]
  )

  const handleLogin = () => {
    if (password === 'admin123') {
      setIsAuthenticated(true)
    } else {
      alert('Password salah!')
    }
  }

  const handleVerifyPayment = async (paymentId: string) => {
    try {
      await verifyPaymentMutation.mutateAsync(paymentId)
      alert('Pembayaran berhasil diverifikasi!')
    } catch (error) {
      alert('Gagal memverifikasi pembayaran: ' + (error as Error).message)
    }
  }

  const handleRejectPayment = async (paymentId: string) => {
    try {
      await rejectPaymentMutation.mutateAsync(paymentId)
      alert('Pembayaran berhasil ditolak')
    } catch (error) {
      alert('Gagal menolak pembayaran: ' + (error as Error).message)
    }
  }

  const handleDeleteCouple = async (coupleId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus undangan ini?')) {
      return
    }
    try {
      await deleteCoupleMutation.mutateAsync(coupleId)
      alert('Undangan berhasil dihapus!')
    } catch (error) {
      alert('Gagal menghapus undangan: ' + (error as Error).message)
    }
  }

  const handleToggleGuests = (coupleId: string) => {
    setExpandedCoupleId(expandedCoupleId === coupleId ? null : coupleId)
  }

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link)
    alert('Link berhasil disalin!')
  }

  const handleImagePreview = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl)
  }

  const closeImagePreview = () => {
    setSelectedImageUrl(null)
  }

  // Loading states
  const isLoading = couplesLoading || paymentsLoading || 
                   verifyPaymentMutation.isPending || 
                   rejectPaymentMutation.isPending || 
                   deleteCoupleMutation.isPending

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
              <h1 className="text-2xl font-bold text-gray-800">Temu Admin (Optimized)</h1>
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

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <input
            type="text"
            placeholder="Cari pasangan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
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
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Memuat data...</p>
              </div>
            ) : couplesError || paymentsError ? (
              <div className="text-center py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {(couplesError as Error)?.message || (paymentsError as Error)?.message || 'Terjadi kesalahan'}
                </div>
              </div>
            ) : (
              <>
                {selectedTab === 'pending' && (
                  <PendingPaymentsTab 
                    payments={pendingPayments}
                    onVerify={handleVerifyPayment}
                    onReject={handleRejectPayment}
                    onImagePreview={handleImagePreview}
                  />
                )}
                
                {selectedTab === 'active' && (
                  <ActiveCouplesTab 
                    couples={activeCouples}
                    expandedCoupleId={expandedCoupleId}
                    onToggleGuests={handleToggleGuests}
                    onDelete={handleDeleteCouple}
                    onCopyLink={handleCopyLink}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {selectedImageUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeImagePreview}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 text-2xl"
            >
              ×
            </button>
            <img
              src={selectedImageUrl}
              alt="Preview"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  )
}

// Komponen untuk tab pending payments
function PendingPaymentsTab({ 
  payments, 
  onVerify, 
  onReject, 
  onImagePreview 
}: {
  payments: Payment[]
  onVerify: (id: string) => void
  onReject: (id: string) => void
  onImagePreview: (url: string) => void
}) {
  if (payments.length === 0) {
    return (
      <div className="text-center py-8">
        <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Tidak ada pembayaran yang perlu diverifikasi</p>
      </div>
    )
  }

  const renderPaymentItem = ({ index, style, data }: { index: number; style: React.CSSProperties; data: Payment[] }) => {
    const payment = data[index]
    
    return (
      <div style={style} className="px-2">
        <div className="border rounded-lg p-6 bg-gray-50 mb-4">
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
                  <LazyImage
                    src={payment.proof_image_url}
                    alt="Bukti Transfer"
                    className="w-full h-48 bg-gray-100 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => onImagePreview(payment.proof_image_url)}
                  />
                  <button
                    onClick={() => onImagePreview(payment.proof_image_url)}
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
                onClick={() => onVerify(payment.id)}
                className="bg-green-500 text-white px-4 py-3 rounded-lg text-sm hover:bg-green-600 transition-colors flex items-center justify-center"
              >
                <Check className="h-4 w-4 mr-2" />
                Verifikasi Pembayaran
              </button>
              <button
                onClick={() => onReject(payment.id)}
                className="bg-red-500 text-white px-4 py-3 rounded-lg text-sm hover:bg-red-600 transition-colors flex items-center justify-center"
              >
                <X className="h-4 w-4 mr-2" />
                Tolak Pembayaran
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <VirtualizedList
      items={payments}
      height={600}
      itemHeight={280}
      renderItem={renderPaymentItem}
      className="w-full"
    />
  )
}

// Komponen untuk tab active couples
function ActiveCouplesTab({ 
  couples, 
  expandedCoupleId, 
  onToggleGuests, 
  onDelete, 
  onCopyLink 
}: {
  couples: Couple[]
  expandedCoupleId: string | null
  onToggleGuests: (id: string) => void
  onDelete: (id: string) => void
  onCopyLink: (link: string) => void
}) {
  if (couples.length === 0) {
    return (
      <div className="text-center py-8">
        <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Tidak ada undangan aktif</p>
      </div>
    )
  }

  const renderCoupleItem = ({ index, style, data }: { index: number; style: React.CSSProperties; data: Couple[] }) => {
    const couple = data[index]
    
    return (
      <div style={style} className="px-2">
        <CoupleCard
          couple={couple}
          isExpanded={expandedCoupleId === couple.id}
          onToggleGuests={() => onToggleGuests(couple.id)}
          onDelete={() => onDelete(couple.id)}
          onCopyLink={onCopyLink}
        />
      </div>
    )
  }

  return (
    <VirtualizedList
      items={couples}
      height={600}
      itemHeight={200}
      renderItem={renderCoupleItem}
      className="w-full"
    />
  )
}

// Komponen untuk card couple
function CoupleCard({ 
  couple, 
  isExpanded, 
  onToggleGuests, 
  onDelete, 
  onCopyLink 
}: {
  couple: Couple
  isExpanded: boolean
  onToggleGuests: () => void
  onDelete: () => void
  onCopyLink: (link: string) => void
}) {
  const { data: guests = [], isLoading: guestsLoading } = useCoupleGuests(couple.id, isExpanded)
  
  const invitationLink = `${window.location.origin}/${couple.slug}`

  return (
    <div className="border rounded-lg p-6 bg-white mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-gray-800 text-lg">
            {couple.groom_name} & {couple.bride_name}
          </h3>
          <div className="space-y-1 text-sm text-gray-600 mt-2">
            <p className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              {couple.wedding_date ? new Date(couple.wedding_date).toLocaleDateString('id-ID') : 'Tanggal belum diset'}
            </p>
            <p className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              {couple.venue || 'Venue belum diset'}
            </p>
            <p className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              Template: {couple.template_name || 'Default'}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={onToggleGuests}
            className="bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 transition-colors flex items-center"
          >
            <Users className="h-4 w-4 mr-1" />
            {isExpanded ? 'Tutup' : 'Lihat'} Tamu
          </button>
          <button
            onClick={() => onCopyLink(invitationLink)}
            className="bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600 transition-colors flex items-center"
          >
            <LinkIcon className="h-4 w-4 mr-1" />
            Copy Link
          </button>
          <button
            onClick={onDelete}
            className="bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 transition-colors flex items-center"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Hapus
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-700 mb-3">Daftar Tamu:</h4>
          {guestsLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-2"></div>
              <p className="text-gray-600 text-sm">Memuat daftar tamu...</p>
            </div>
          ) : guests.length === 0 ? (
            <p className="text-gray-500 text-sm">Belum ada tamu yang ditambahkan</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {guests.map((guest) => (
                <div key={guest.id} className="bg-gray-50 p-3 rounded border">
                  <p className="font-medium text-gray-800">{guest.name}</p>
                  <p className="text-sm text-gray-600">
                    {guest.phone || 'No phone'}
                  </p>
                  <button
                    onClick={() => onCopyLink(`${invitationLink}/${guest.slug}`)}
                    className="mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors flex items-center"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy Link Personal
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function AdminPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminPageContent />
    </QueryClientProvider>
  )
}


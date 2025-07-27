import Link from 'next/link'
import { Heart, Sparkles, Users, Gift } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-pink-500" />
            <h1 className="text-2xl font-bold text-gray-800">Temu</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link href="#features" className="text-gray-600 hover:text-pink-500 transition-colors">
              Fitur
            </Link>
            <Link href="#templates" className="text-gray-600 hover:text-pink-500 transition-colors">
              Template
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-pink-500 transition-colors">
              Harga
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            Undangan Pernikahan
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
              {' '}Digital
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Buat undangan pernikahan digital yang elegan dan personal untuk hari bahagia Anda. 
            Mudah dibuat, mudah dibagikan, dan tak terlupakan.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/create"
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
            >
              <Sparkles className="h-5 w-5" />
              <span>Buat Undangan</span>
            </Link>
            <Link 
              href="/templates"
              className="border-2 border-pink-500 text-pink-500 px-8 py-4 rounded-full font-semibold text-lg hover:bg-pink-500 hover:text-white transition-all duration-200 flex items-center space-x-2"
            >
              <Gift className="h-5 w-5" />
              <span>Lihat Template</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">Mengapa Memilih Temu?</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Platform undangan digital terdepan dengan fitur lengkap untuk membuat hari pernikahan Anda semakin istimewa
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-pink-500" />
            </div>
            <h4 className="text-xl font-semibold text-gray-800 mb-2">Template Elegan</h4>
            <p className="text-gray-600">
              Pilihan template yang indah dan dapat disesuaikan dengan tema pernikahan Anda
            </p>
          </div>
          
          <div className="text-center p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-purple-500" />
            </div>
            <h4 className="text-xl font-semibold text-gray-800 mb-2">Link Personal</h4>
            <p className="text-gray-600">
              Setiap tamu mendapat link undangan personal yang unik dan privat
            </p>
          </div>
          
          <div className="text-center p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-green-500" />
            </div>
            <h4 className="text-xl font-semibold text-gray-800 mb-2">Mudah Dibagikan</h4>
            <p className="text-gray-600">
              Bagikan undangan melalui WhatsApp, email, atau media sosial dengan mudah
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-16 bg-gray-50 rounded-3xl mx-4">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">Harga Terjangkau</h3>
          <p className="text-gray-600">Satu harga untuk semua fitur premium</p>
        </div>
        
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center border-2 border-pink-200">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full px-4 py-2 text-sm font-semibold mb-4 inline-block">
              Paket Lengkap
            </div>
            <div className="text-4xl font-bold text-gray-800 mb-2">
              Rp 50.000
            </div>
            <p className="text-gray-600 mb-6">Sekali bayar, selamanya</p>
            
            <ul className="text-left space-y-3 mb-8">
              <li className="flex items-center">
                <Heart className="h-5 w-5 text-pink-500 mr-3" />
                <span>Template premium unlimited</span>
              </li>
              <li className="flex items-center">
                <Heart className="h-5 w-5 text-pink-500 mr-3" />
                <span>Tamu undangan unlimited</span>
              </li>
              <li className="flex items-center">
                <Heart className="h-5 w-5 text-pink-500 mr-3" />
                <span>Link personal untuk setiap tamu</span>
              </li>
              <li className="flex items-center">
                <Heart className="h-5 w-5 text-pink-500 mr-3" />
                <span>Support 24/7</span>
              </li>
            </ul>
            
            <Link 
              href="/create"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 inline-block"
            >
              Mulai Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Heart className="h-6 w-6 text-pink-500" />
          <span className="font-semibold">Temu</span>
        </div>
        <p>&copy; 2024 Temu. Dibuat dengan ❤️ untuk pasangan bahagia.</p>
      </footer>
    </div>
  )
}


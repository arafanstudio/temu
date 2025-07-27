'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ArrowLeft, Eye } from 'lucide-react'
import { Template } from '@/types'

// Mock data untuk template sementara
const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'elegant',
    display_name: 'Elegant Classic',
    preview_image_url: '',
    folder_path: '/templates/elegant',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'modern',
    display_name: 'Modern Minimalist',
    preview_image_url: '',
    folder_path: '/templates/modern',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'floral',
    display_name: 'Floral Garden',
    preview_image_url: '',
    folder_path: '/templates/floral',
    is_active: true,
    created_at: new Date().toISOString()
  }
]

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulasi loading
    setTimeout(() => {
      setTemplates(mockTemplates)
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-12 w-12 text-pink-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Memuat template...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-pink-500 transition-colors">
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
      <section className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Pilih Template
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
              {' '}Favorit Anda
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Koleksi template undangan pernikahan yang elegan dan modern, 
            siap disesuaikan dengan tema pernikahan impian Anda.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template) => (
            <div key={template.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="relative h-64 bg-gradient-to-br from-pink-100 to-purple-100">
                <div className="flex items-center justify-center h-full">
                  <Heart className="h-16 w-16 text-pink-300" />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="bg-white text-gray-800 px-4 py-2 rounded-full font-semibold flex items-center space-x-2 hover:bg-gray-100 transition-colors">
                      <Eye className="h-4 w-4" />
                      <span>Preview</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {template.display_name}
                </h3>
                <p className="text-gray-600 mb-4">
                  Template elegan dengan design modern yang cocok untuk berbagai tema pernikahan.
                </p>
                
                <Link
                  href={`/create?template=${template.id}`}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 inline-block text-center"
                >
                  Pilih Template
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Siap Membuat Undangan Impian?
          </h3>
          <p className="text-gray-600 mb-6">
            Mulai buat undangan pernikahan digital Anda sekarang juga!
          </p>
          <Link
            href="/create"
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 inline-block"
          >
            Buat Undangan Sekarang
          </Link>
        </div>
      </section>
    </div>
  )
}


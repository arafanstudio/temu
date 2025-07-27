'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import TemplateEngine, { TemplateData } from '@/utils/templateEngine'

// Sample data for preview
const sampleData: TemplateData = {
  groom_name: 'Ahmad Rizki',
  bride_name: 'Sari Dewi',
  guest_name: 'Keluarga Besar Wijaya',
  event_date: '2024-12-25',
  event_date_formatted: 'Rabu, 25 Desember 2024',
  event_time: '10:00',
  event_location: 'Gedung Serbaguna Merdeka',
  event_address: 'Jl. Merdeka No. 123, Kelurahan Merdeka, Kecamatan Pusat, Jakarta Pusat 10110',
  couple_slug: 'ahmad-rizki-sari-dewi',
  guest_slug: 'keluarga-besar-wijaya'
}

export default function TemplatePreviewPage() {
  const params = useParams()
  const [renderedHtml, setRenderedHtml] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const renderTemplate = async () => {
      try {
        const templateName = params.templateName as string
        
        // Render template with sample data
        const response = await fetch(`/api/template/${templateName}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sampleData),
        })

        const result = await response.json()

        if (result.success) {
          setRenderedHtml(result.html)
        } else {
          setError(result.error || 'Failed to render template')
        }
      } catch (err) {
        setError('Failed to load template')
        console.error('Template preview error:', err)
      } finally {
        setLoading(false)
      }
    }

    renderTemplate()
  }, [params.templateName])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat preview template...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button
            onClick={() => window.history.back()}
            className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
          >
            Kembali
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="template-preview">
      {/* Preview Header */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="text-gray-600 hover:text-pink-500 transition-colors"
              >
                ← Kembali
              </button>
              <div>
                <h1 className="font-semibold text-gray-800">
                  Preview Template: {params.templateName}
                </h1>
                <p className="text-sm text-gray-600">
                  Ini adalah preview dengan data contoh
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Preview Mode
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Template Content */}
      <div className="pt-20">
        <div 
          dangerouslySetInnerHTML={{ __html: renderedHtml }}
          className="template-content"
        />
      </div>
    </div>
  )
}



'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Heart, Calendar, MapPin, Clock, User, Share2, Copy, CheckCircle } from 'lucide-react'
import { InvitationData, Couple, Guest, Template } from '@/types'

export default function InvitationPage() {
  const params = useParams()
  const { coupleSlug, guestSlug } = params
  const [invitationData, setInvitationData] = useState<InvitationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [rsvpStatus, setRsvpStatus] = useState<"attending" | "not-attending" | null>(null)
  const [templateContent, setTemplateContent] = useState<{ html: string; css: string; js: string } | null>(null)
  const [templateName, setTemplateName] = useState<string | null>(null)

  const fetchTemplateContent = async (templateName: string, couple: Couple, guest: Guest) => {
    try {
      // Create template data using TemplateEngine format
      const templateData = {
        groom_name: couple.groom_name,
        bride_name: couple.bride_name,
        guest_name: guest.name,
        event_date: couple.event_date,
        event_date_formatted: new Date(couple.event_date).toLocaleDateString('id-ID', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        event_time: couple.event_time,
        event_location: couple.event_location,
        event_address: couple.event_address,
        couple_slug: couple.slug,
        guest_slug: guest.slug
      }

      // Fetch rendered HTML
      const htmlResponse = await fetch(`/api/template/${templateName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData),
      })
      
      const htmlData = await htmlResponse.json()
      
      // Fetch CSS and JS assets
      const assetsResponse = await fetch(`/api/template/${templateName}`, {
        method: 'GET',
      })
      
      const assetsData = await assetsResponse.json()
      
      if (htmlData.success && assetsData.success) {
        setTemplateContent({
          html: htmlData.html,
          css: assetsData.assets?.css || '',
          js: assetsData.assets?.js || ''
        })
      }
    } catch (error) {
      console.error('Error fetching template content:', error)
    }
  }

  useEffect(() => {
    const fetchInvitationData = async () => {
      if (!coupleSlug || !guestSlug) {
        setLoading(false)
        setError('Couple slug or guest slug is missing.')
        return
      }

      try {
        const response = await fetch(`/api/invitation/${coupleSlug}/${guestSlug}`)
        const data = await response.json()

        if (data.success) {
          setInvitationData(data.data)
          
          // Get template name from template_id
          const templateId = data.data.couple.template_id
          if (templateId) {
            // Fetch template name from templates table or use template_id directly if it's already the name
            // For now, assuming we need to fetch template name
            const templateResponse = await fetch(`/api/templates`)
            const templatesData = await templateResponse.json()
            
            if (templatesData.templates) {
              const template = templatesData.templates.find((t: Template) => t.id === templateId)
              if (template) {
                setTemplateName(template.name)
                
                // Fetch template content
                await fetchTemplateContent(template.name, data.data.couple, data.data.guest)
              }
            }
          }
        } else {
          setError(data.error || 'Failed to fetch invitation data.')
        }
      } catch (err: unknown) {
        let errorMessage = 'An unexpected error occurred.';
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        setError(errorMessage);
      } finally {
        setLoading(false)
      }
    }

    fetchInvitationData()
  }, [coupleSlug, guestSlug])

  useEffect(() => {
    if (templateContent) {
      // Inject CSS
      if (templateContent.css) {
        const styleElement = document.createElement('style')
        styleElement.textContent = templateContent.css
        document.head.appendChild(styleElement)
        
        // Cleanup function to remove style when component unmounts
        return () => {
          document.head.removeChild(styleElement)
        }
      }
    }
  }, [templateContent])

  useEffect(() => {
    if (templateContent && templateContent.js) {
      // Inject JavaScript
      const scriptElement = document.createElement('script')
      scriptElement.textContent = templateContent.js
      document.body.appendChild(scriptElement)
      
      // Cleanup function to remove script when component unmounts
      return () => {
        document.body.removeChild(scriptElement)
      }
    }
  }, [templateContent])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    return timeString + ' WIB'
  }

  const handleCopyLink = () => {
    const currentUrl = window.location.href
    navigator.clipboard.writeText(currentUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRSVP = (status: 'attending' | 'not-attending') => {
    setRsvpStatus(status)
    // Here you would typically save the RSVP to database
    if (invitationData) {
      console.log(`RSVP: ${status} for guest ${invitationData.guest.name}`)
    }
  }

  const addToCalendar = () => {
    if (!invitationData) return
    const { couple } = invitationData
    const startDate = new Date(`${couple.event_date}T${couple.event_time}:00`)
    const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000) // 4 hours later
    
    const formatDateForCalendar = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    }

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Pernikahan ${couple.groom_name} & ${couple.bride_name}`)}&dates=${formatDateForCalendar(startDate)}/${formatDateForCalendar(endDate)}&details=${encodeURIComponent(`Undangan pernikahan ${couple.groom_name} & ${couple.bride_name}`)}&location=${encodeURIComponent(couple.event_address)}`
    
    window.open(calendarUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-12 w-12 text-pink-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Memuat undangan...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    )
  }

  if (!invitationData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Data undangan tidak ditemukan.</p>
        </div>
      </div>
    )
  }

  // If template content is available, render it dynamically
  if (templateContent && templateContent.html) {
    return (
      <div 
        dangerouslySetInnerHTML={{ __html: templateContent.html }}
      />
    )
  }

  // Fallback to static template if dynamic template is not available
  const { couple, guest } = invitationData

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Decorative Hearts */}
          <div className="absolute top-10 left-10 text-pink-200">
            <Heart className="h-8 w-8" />
          </div>
          <div className="absolute top-20 right-16 text-purple-200">
            <Heart className="h-6 w-6" />
          </div>
          <div className="absolute bottom-10 left-20 text-pink-200">
            <Heart className="h-4 w-4" />
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-12">
            <p className="text-gray-600 mb-4 text-lg">Dengan penuh sukacita, kami mengundang</p>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              {guest.name}
            </h1>
            
            <p className="text-gray-600 mb-8 text-lg">
              untuk hadir dalam acara pernikahan kami
            </p>
            
            <div className="space-y-4 mb-8">
              <h2 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                {couple.groom_name}
              </h2>
              <div className="flex items-center justify-center">
                <div className="h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent flex-1"></div>
                <Heart className="h-8 w-8 text-pink-500 mx-4" />
                <div className="h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent flex-1"></div>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                {couple.bride_name}
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* Event Details */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
            <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Detail Acara
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-pink-500" />
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">Tanggal</h4>
                <p className="text-gray-600 text-lg">{formatDate(couple.event_date)}</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-purple-500" />
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">Waktu</h4>
                <p className="text-gray-600 text-lg">{formatTime(couple.event_time)}</p>
              </div>
              
              <div className="text-center md:col-span-2">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-green-500" />
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">Lokasi</h4>
                <p className="text-gray-800 text-lg font-medium mb-2">{couple.event_location}</p>
                <p className="text-gray-600">{couple.event_address}</p>
                <button
                  onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(couple.event_address)}`, '_blank')}
                  className="mt-4 bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors"
                >
                  Buka di Google Maps
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
            <h3 className="text-3xl font-bold text-center text-gray-800 mb-6">
              Konfirmasi Kehadiran
            </h3>
            <p className="text-gray-600 mb-8">
              Mohon konfirmasi kehadiran Anda untuk membantu kami dalam persiapan acara
            </p>
            
            {rsvpStatus ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-green-800 font-semibold text-lg">
                  Terima kasih atas konfirmasi Anda!
                </p>
                <p className="text-green-600">
                  Status: {rsvpStatus === 'attending' ? 'Akan Hadir' : 'Tidak Dapat Hadir'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={() => handleRSVP('attending')}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Ya, Saya Akan Hadir
                </button>
                <button
                  onClick={() => handleRSVP('not-attending')}
                  className="w-full border-2 border-gray-300 text-gray-600 py-4 rounded-xl font-semibold text-lg hover:border-gray-400 transition-colors"
                >
                  Maaf, Saya Tidak Dapat Hadir
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Actions */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
              Simpan & Bagikan
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={addToCalendar}
                className="flex items-center justify-center space-x-2 bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
              >
                <Calendar className="h-5 w-5" />
                <span>Tambah ke Kalender</span>
              </button>
              
              <button
                onClick={handleCopyLink}
                className="flex items-center justify-center space-x-2 border-2 border-gray-300 text-gray-600 py-3 rounded-xl font-semibold hover:border-gray-400 transition-colors"
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-green-500">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-5 w-5" />
                    <span>Salin Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-6 w-6 text-pink-500" />
            <span className="font-semibold text-gray-600">Temu</span>
          </div>
          <p className="text-gray-500 text-sm">
            Undangan digital yang dibuat dengan ❤️
          </p>
        </div>
      </footer>
    </div>
  )
}





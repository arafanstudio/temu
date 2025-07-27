
'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Heart, ArrowLeft, ArrowRight, Check, Users, Calendar, MapPin, User } from 'lucide-react'
import { Template, CreateInvitationRequest } from '@/types'

export default function CreatePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [formData, setFormData] = useState<CreateInvitationRequest>({
    groomName: '',
    brideName: '',
    eventDate: '',
    eventTime: '',
    eventLocation: '',
    eventAddress: '',
    templateId: '',
    guests: ['']
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [templates, setTemplates] = useState<Template[]>([])

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch("/api/templates")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setTemplates(data.templates)
      } catch (error) {
        console.error("Failed to fetch templates:", error)
      }
    }

    fetchTemplates()

    const templateName = searchParams.get("template")
    if (templateName) {
      const template = templates.find(t => t.name === templateName)
      if (template) {
        setSelectedTemplate(template)
        setFormData(prev => ({ ...prev, templateId: template.id })) // Set templateId to template.id (UUID)
        setCurrentStep(2)
      }
    }
  }, [searchParams, templates])

  const steps = [
    { id: 1, title: 'Pilih Template', icon: Heart },
    { id: 2, title: 'Data Pernikahan', icon: User },
    { id: 3, title: 'Daftar Tamu', icon: Users },
    { id: 4, title: 'Preview & Simpan', icon: Check }
  ]

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template)
    setFormData(prev => ({ ...prev, templateId: template.id })) // Set templateId to template.id (UUID)
    handleNext()
  }

  const handleInputChange = (field: keyof CreateInvitationRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleGuestChange = (index: number, value: string) => {
    const newGuests = [...formData.guests]
    newGuests[index] = value
    setFormData(prev => ({ ...prev, guests: newGuests }))
  }

  const addGuest = () => {
    setFormData(prev => ({ ...prev, guests: [...prev.guests, ''] }))
  }

  const removeGuest = (index: number) => {
    if (formData.guests.length > 1) {
      const newGuests = formData.guests.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, guests: newGuests }))
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedTemplate !== null
      case 2:
        return formData.groomName && formData.brideName && formData.eventDate && 
               formData.eventTime && formData.eventLocation && formData.eventAddress
      case 3:
        return formData.guests.filter(guest => guest.trim()).length > 0
      default:
        return true
    }
  }

  const handleSubmit = async () => {
    setIsSaving(true)
    setSaveError('')
    try {
      // Here you would typically send formData to your API to save the invitation
      // For now, we'll simulate a successful save and redirect
      console.log("Sending invitation data:", formData)
      
      // Simulate API call
      const response = await fetch('/api/create-invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem('currentCoupleId', result.coupleId); // Save coupleId to localStorage
        alert('Undangan berhasil disimpan! Lanjut ke pembayaran.');
        router.push('/payment'); // Navigate to payment page
      } else {
        setSaveError(result.error || 'Gagal menyimpan undangan.');
      }
    } catch (error) {
      console.error('Error saving invitation:', error)
      setSaveError('Terjadi kesalahan saat menyimpan undangan.')
    } finally {
      setIsSaving(false)
    }
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

      {/* Progress Steps */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                    isCompleted 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : isActive 
                        ? 'bg-pink-500 border-pink-500 text-white' 
                        : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    {isCompleted ? <Check className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${isActive ? 'text-pink-500' : isCompleted ? 'text-green-500' : 'text-gray-400'}`}>
                      Langkah {step.id}
                    </p>
                    <p className={`text-xs ${isActive ? 'text-gray-800' : 'text-gray-500'}`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`} />
                  )}
                </div>
              )
            })}
          </div>

          {/* Step Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Step 1: Template Selection */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  Pilih Template Undangan
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {templates.map((template) => (
                    <div 
                      key={template.id}
                      onClick={() => handleTemplateSelect(template)}
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg ${
                        selectedTemplate?.id === template.id 
                          ? 'border-pink-500 bg-pink-50' 
                          : 'border-gray-200 hover:border-pink-300'
                      }`}
                    >
                      <div className="h-32 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg mb-4 flex items-center justify-center">
                        <Heart className="h-12 w-12 text-pink-300" />
                      </div>
                      <h3 className="font-semibold text-gray-800 text-center">
                        {template.display_name}
                      </h3>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Wedding Data */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  Data Pernikahan
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Pengantin Pria
                    </label>
                    <input
                      type="text"
                      value={formData.groomName}
                      onChange={(e) => handleInputChange('groomName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Masukkan nama pengantin pria"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Pengantin Wanita
                    </label>
                    <input
                      type="text"
                      value={formData.brideName}
                      onChange={(e) => handleInputChange('brideName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Masukkan nama pengantin wanita"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Acara
                    </label>
                    <input
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => handleInputChange('eventDate', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent relative z-10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Waktu Acara
                    </label>
                    <input
                      type="time"
                      value={formData.eventTime}
                      onChange={(e) => handleInputChange('eventTime', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent relative z-10"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lokasi Acara
                    </label>
                    <input
                      type="text"
                      value={formData.eventLocation}
                      onChange={(e) => handleInputChange('eventLocation', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Contoh: Gedung Serbaguna ABC"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alamat Lengkap
                    </label>
                    <textarea
                      value={formData.eventAddress}
                      onChange={(e) => handleInputChange('eventAddress', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Masukkan alamat lengkap lokasi acara"
                    />
                  </div>
                </div>
                <div className="flex justify-between mt-8">
                  <button
                    onClick={handlePrev}
                    className="px-6 py-3 rounded-full font-semibold text-gray-600 border border-gray-300 hover:bg-gray-100 transition-colors"
                  >
                    <ArrowLeft className="inline-block w-5 h-5 mr-2" /> Kembali
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className={`px-6 py-3 rounded-full font-semibold text-white transition-colors ${
                      canProceed()
                        ? 'bg-pink-500 hover:bg-pink-600'
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    Lanjutkan <ArrowRight className="inline-block w-5 h-5 ml-2" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Guest List */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  Daftar Tamu Undangan
                </h2>
                <p className="text-gray-600 text-center mb-6">
                  Setiap tamu akan mendapat link undangan personal yang unik
                </p>
                <div className="space-y-4">
                  {formData.guests.map((guest, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={guest}
                          onChange={(e) => handleGuestChange(index, e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          placeholder={`Nama tamu ${index + 1}`}
                        />
                      </div>
                      {formData.guests.length > 1 && (
                        <button
                          onClick={() => removeGuest(index)}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addGuest}
                    className="w-full py-3 border-2 border-dashed border-pink-300 text-pink-500 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-colors"
                  >
                    + Tambah Tamu
                  </button>
                </div>
                <div className="flex justify-between mt-8">
                  <button
                    onClick={handlePrev}
                    className="px-6 py-3 rounded-full font-semibold text-gray-600 border border-gray-300 hover:bg-gray-100 transition-colors"
                  >
                    <ArrowLeft className="inline-block w-5 h-5 mr-2" /> Kembali
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className={`px-6 py-3 rounded-full font-semibold text-white transition-colors ${
                      canProceed()
                        ? 'bg-pink-500 hover:bg-pink-600'
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    Lanjutkan <ArrowRight className="inline-block w-5 h-5 ml-2" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Preview */}
            {currentStep === 4 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  Preview & Konfirmasi
                </h2>
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Ringkasan Undangan</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Template:</p>
                      <p className="font-medium">{selectedTemplate?.display_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Pengantin:</p>
                      <p className="font-medium">{formData.groomName} & {formData.brideName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Tanggal & Waktu:</p>
                      <p className="font-medium">{formData.eventDate} - {formData.eventTime}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Lokasi:</p>
                      <p className="font-medium">{formData.eventLocation}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-gray-600">Jumlah Tamu:</p>
                      <p className="font-medium">{formData.guests.filter(g => g.trim()).length} orang</p>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    Setelah menyimpan, Anda akan diarahkan ke halaman pembayaran
                  </p>
                  {saveError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                      <strong className="font-bold">Error!</strong>
                      <span className="block sm:inline"> {saveError}</span>
                    </div>
                  )}
                  <button
                    onClick={handleSubmit}
                    disabled={isSaving || !canProceed()}
                    className={`mt-6 w-full md:w-auto px-8 py-3 rounded-full font-semibold text-lg transition-all duration-200 ${
                      canProceed() && !isSaving
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg transform hover:scale-105'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isSaving ? 'Menyimpan...' : 'Simpan & Lanjutkan'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}



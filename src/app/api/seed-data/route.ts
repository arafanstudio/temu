import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST() {
  try {
    // Get template IDs first
    const { data: templates, error: templatesError } = await supabaseAdmin
      .from('templates')
      .select('id, name')

    if (templatesError) {
      console.error('Error fetching templates:', templatesError)
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch templates',
        details: templatesError.message
      }, { status: 500 })
    }

    const elegantTemplate = templates.find(t => t.name === 'elegant')
    const modernTemplate = templates.find(t => t.name === 'modern')
    const floralTemplate = templates.find(t => t.name === 'floral')

    // Sample couples data
    const sampleCouples = [
      {
        groom_name: 'Ahmad Rizki',
        bride_name: 'Sari Dewi',
        event_date: '2024-12-25',
        event_time: '10:00',
        event_location: 'Gedung Serbaguna Merdeka',
        event_address: 'Jl. Merdeka No. 123, Kelurahan Merdeka, Kecamatan Pusat, Jakarta Pusat 10110',
        template_id: elegantTemplate?.id,
        slug: 'ahmad-rizki-sari-dewi',
        is_active: true,
        payment_verified: true,
        created_at: new Date().toISOString()
      },
      {
        groom_name: 'Budi Santoso',
        bride_name: 'Maya Indira',
        event_date: '2024-11-15',
        event_time: '14:00',
        event_location: 'Hotel Grand Ballroom',
        event_address: 'Jl. Sudirman No. 456, Jakarta Selatan 12190',
        template_id: modernTemplate?.id,
        slug: 'budi-santoso-maya-indira',
        is_active: true,
        payment_verified: true,
        created_at: new Date().toISOString()
      },
      {
        groom_name: 'Doni Pratama',
        bride_name: 'Rina Sari',
        event_date: '2025-01-20',
        event_time: '16:00',
        event_location: 'Taman Bunga Nusantara',
        event_address: 'Jl. Raya Puncak KM 77, Cipanas, Cianjur 43253',
        template_id: floralTemplate?.id,
        slug: 'doni-pratama-rina-sari',
        is_active: false,
        payment_verified: false,
        created_at: new Date().toISOString()
      }
    ]

    // Insert couples data
    const { data: couplesData, error: couplesError } = await supabaseAdmin
      .from('couples')
      .insert(sampleCouples)
      .select()

    if (couplesError) {
      console.error('Error inserting couples:', couplesError)
      return NextResponse.json({
        success: false,
        error: 'Failed to insert couples data',
        details: couplesError.message
      }, { status: 500 })
    }

    // Sample guests data
    const sampleGuests = [
      {
        couple_id: couplesData[0].id,
        name: 'Keluarga Wijaya',
        slug: 'keluarga-wijaya',
        created_at: new Date().toISOString()
      },
      {
        couple_id: couplesData[0].id,
        name: 'Keluarga Susanto',
        slug: 'keluarga-susanto',
        created_at: new Date().toISOString()
      },
      {
        couple_id: couplesData[1].id,
        name: 'Teman Kantor',
        slug: 'teman-kantor',
        created_at: new Date().toISOString()
      },
      {
        couple_id: couplesData[2].id,
        name: 'Keluarga Besar',
        slug: 'keluarga-besar',
        created_at: new Date().toISOString()
      }
    ]

    // Insert guests data
    const { data: guestsData, error: guestsError } = await supabaseAdmin
      .from('guests')
      .insert(sampleGuests)
      .select()

    if (guestsError) {
      console.error('Error inserting guests:', guestsError)
      return NextResponse.json({
        success: false,
        error: 'Failed to insert guests data',
        details: guestsError.message
      }, { status: 500 })
    }

    // Sample payments data
    const samplePayments = [
      {
        couple_id: couplesData[0].id,
        amount: 50000,
        proof_image_url: 'https://example.com/proof1.jpg',
        status: 'verified',
        verified_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      },
      {
        couple_id: couplesData[1].id,
        amount: 50000,
        proof_image_url: 'https://example.com/proof2.jpg',
        status: 'verified',
        verified_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      },
      {
        couple_id: couplesData[2].id,
        amount: 50000,
        proof_image_url: 'https://example.com/proof3.jpg',
        status: 'pending',
        created_at: new Date().toISOString()
      }
    ]

    // Insert payments data
    const { data: paymentsData, error: paymentsError } = await supabaseAdmin
      .from('payments')
      .insert(samplePayments)
      .select()

    if (paymentsError) {
      console.error('Error inserting payments:', paymentsError)
      return NextResponse.json({
        success: false,
        error: 'Failed to insert payments data',
        details: paymentsError.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Sample data inserted successfully',
      data: {
        couples: couplesData.length,
        guests: guestsData.length,
        payments: paymentsData.length,
        templates: templates.length
      },
      timestamp: new Date().toISOString()
    })

  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json({
      success: false,
      error: 'Unexpected error occurred',
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 })
  }
}


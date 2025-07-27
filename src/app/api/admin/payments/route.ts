import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let query = supabaseAdmin
      .from('payments')
      .select(`
        *,
        couples (
          groom_name,
          bride_name,
          event_date,
          slug
        )
      `)
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching payments:', error)
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch payments data',
        details: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      count: data?.length || 0
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


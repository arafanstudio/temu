import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Test basic connection
    const { error } = await supabase
      .from('couples')
      .select('count')
      .limit(1)

    if (error) {
      console.error('Database connection error:', error)
      return NextResponse.json({
        success: false,
        error: error.message,
        details: 'Failed to connect to Supabase'
      }, { status: 500 })
    }

    // Test if tables exist
    const { error: tablesError } = await supabase
      .rpc('get_table_info')
      .select()

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      connection: 'OK',
      tables_accessible: !tablesError,
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


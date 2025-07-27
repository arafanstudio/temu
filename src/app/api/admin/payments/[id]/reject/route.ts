import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paymentId } = await params

    // Update payment status to rejected
    const { error: paymentError } = await supabaseAdmin
      .from('payments')
      .update({
        status: 'rejected',
        verified_at: new Date().toISOString()
      })
      .eq('id', paymentId)

    if (paymentError) {
      console.error('Error rejecting payment:', paymentError)
      return NextResponse.json({
        success: false,
        error: 'Failed to reject payment',
        details: paymentError.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Payment rejected successfully'
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


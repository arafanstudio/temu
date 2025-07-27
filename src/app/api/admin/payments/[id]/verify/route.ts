import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paymentId } = await params

    // Update payment status to verified
    const { data: paymentData, error: paymentError } = await supabaseAdmin
      .from('payments')
      .update({
        status: 'verified',
        verified_at: new Date().toISOString()
      })
      .eq('id', paymentId)
      .select('couple_id')
      .single()

    if (paymentError) {
      console.error('Error updating payment:', paymentError)
      return NextResponse.json({
        success: false,
        error: 'Failed to verify payment',
        details: paymentError.message
      }, { status: 500 })
    }

    // Update couple status to active and payment_verified
    const { error: coupleError } = await supabaseAdmin
      .from('couples')
      .update({
        is_active: true,
        payment_verified: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', paymentData.couple_id)

    if (coupleError) {
      console.error('Error updating couple:', coupleError)
      return NextResponse.json({
        success: false,
        error: 'Payment verified but failed to activate couple',
        details: coupleError.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and couple activated successfully'
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



import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.couple_id || !data.amount || !data.proof_image_url) {
      return NextResponse.json({ success: false, error: 'Missing required payment fields' }, { status: 400 });
    }

    const { data: payment, error } = await supabase
      .from('payments')
      .insert({
        couple_id: data.couple_id,
        amount: data.amount,
        proof_image_url: data.proof_image_url,
        status: data.status || 'pending',
      })
      .select();

    if (error) {
      console.error('Error inserting payment:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, paymentId: payment[0].id });
  } catch (error: unknown) {
    let errorMessage = 'Internal server error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}



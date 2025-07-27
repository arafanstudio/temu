
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(request: Request, { params }: { params: Promise<{ coupleSlug: string, guestSlug: string }> }) {
  try {
    const { coupleSlug, guestSlug } = await params;

    if (!coupleSlug || !guestSlug) {
      return NextResponse.json({ success: false, error: 'Couple slug and guest slug are required' }, { status: 400 });
    }

    // Fetch couple data
    const { data: coupleData, error: coupleError } = await supabase
      .from('couples')
      .select('*')
      .eq('slug', coupleSlug)
      .single();

    if (coupleError) {
      console.error('Error fetching couple:', coupleError);
      return NextResponse.json({ success: false, error: coupleError.message }, { status: 500 });
    }

    if (!coupleData) {
      return NextResponse.json({ success: false, error: 'Couple not found' }, { status: 404 });
    }

    // Check if payment is verified and invitation is active
    if (!coupleData.payment_verified || !coupleData.is_active) {
      return NextResponse.json({ success: false, error: 'Invitation not active. Payment not verified.' }, { status: 403 });
    }

    // Fetch guest data
    const { data: guestData, error: guestError } = await supabase
      .from('guests')
      .select('*')
      .eq('slug', guestSlug)
      .eq('couple_id', coupleData.id) // Ensure guest belongs to the couple
      .single();

    if (guestError) {
      console.error('Error fetching guest:', guestError);
      return NextResponse.json({ success: false, error: guestError.message }, { status: 500 });
    }

    if (!guestData) {
      return NextResponse.json({ success: false, error: 'Guest not found for this couple' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { couple: coupleData, guest: guestData } });
  } catch (error: unknown) {
    let errorMessage = 'Internal server error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}




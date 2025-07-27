
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { CreateInvitationRequest } from '@/types';
import { generateSlug } from '@/utils/slug';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: Request) {
  try {
    const data: CreateInvitationRequest = await request.json();

    // Basic validation
    if (!data.groomName || !data.brideName || !data.eventDate || !data.templateId) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Get template_id from templates table based on template ID (UUID)
    const { data: templateData, error: templateError } = await supabase
      .from('templates')
      .select('id')
      .eq('id', data.templateId) // Change from 'name' to 'id'
      .single();

    if (templateError || !templateData) {
      console.error('Error fetching template ID:', templateError);
      return NextResponse.json({ success: false, error: 'Invalid template selected' }, { status: 400 });
    }

    const templateUuid = templateData.id;

    // Generate couple slug
    const coupleSlug = generateSlug(`${data.groomName}-${data.brideName}`);

    // Insert couple data
    const { data: couple, error: coupleError } = await supabase
      .from('couples')
      .insert({
        groom_name: data.groomName,
        bride_name: data.brideName,
        event_date: data.eventDate,
        event_time: data.eventTime,
        event_location: data.eventLocation,
        event_address: data.eventAddress,
        slug: coupleSlug,
        template_id: templateUuid, // Use template_id (UUID) here
        is_active: false, // Not active until payment is verified
        payment_verified: false,
      })
      .select();

    if (coupleError) {
      console.error('Error inserting couple:', coupleError);
      return NextResponse.json({ success: false, error: coupleError.message }, { status: 500 });
    }

    const coupleId = couple[0].id;

    // Insert guests data
    const guestInserts = data.guests.filter(guestName => guestName.trim() !== '').map(guestName => ({
      couple_id: coupleId,
      name: guestName,
      slug: generateSlug(guestName),
    }));

    if (guestInserts.length > 0) {
      const { error: guestError } = await supabase
        .from('guests')
        .insert(guestInserts);

      if (guestError) {
        console.error('Error inserting guests:', guestError);
        // Consider rolling back couple insertion if guest insertion fails
        return NextResponse.json({ success: false, error: guestError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, coupleId: coupleId, coupleSlug: coupleSlug });
  } catch (error: any) {
    console.error('Unhandled error in create-invitation API:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}




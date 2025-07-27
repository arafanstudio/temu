
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET() {
  try {
    const { data: templates, error } = await supabase
      .from('templates')
      .select('*');

    if (error) {
      console.error('Error fetching templates from Supabase:', error);
      return NextResponse.json({ success: false, error: 'Failed to fetch templates' }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      templates
    });
  } catch (error) {
    console.error('Unhandled error in templates API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}



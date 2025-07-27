import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status'); // 'active', 'pending', 'all'
    
    const offset = (page - 1) * limit;

    let query = supabase
      .from('couples')
      .select('*', { count: 'exact' });

    // Apply search filter
    if (search) {
      query = query.or(`groom_name.ilike.%${search}%,bride_name.ilike.%${search}%`);
    }

    // Apply status filter
    if (status === 'active') {
      query = query.eq('is_active', true).eq('payment_verified', true);
    } else if (status === 'pending') {
      query = query.eq('payment_verified', false);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    // Order by created_at desc for better performance
    query = query.order('created_at', { ascending: false });

    const { data: couples, error, count } = await query;

    if (error) {
      console.error('Error fetching couples:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Calculate pagination info
    const totalPages = Math.ceil((count || 0) / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({ 
      success: true, 
      data: couples,
      pagination: {
        page,
        limit,
        total: count,
        totalPages,
        hasNextPage,
        hasPrevPage
      }
    });
  } catch (error: unknown) {
    let errorMessage = 'Internal server error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}


import { supabase } from './supabase'
import { Couple, Payment, Template, CreateInvitationRequest } from '@/types'
import { generateCoupleSlug, generateGuestSlug } from '@/utils/slug'
import { v4 as uuidv4 } from 'uuid'

// Templates
export async function getTemplates() {
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .eq('is_active', true)
    .order('created_at')
  
  if (error) throw error
  return data as Template[]
}

export async function getTemplateById(id: string) {
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data as Template
}

// Couples
export async function createCouple(request: CreateInvitationRequest) {
  const slug = generateCoupleSlug(request.groomName, request.brideName)
  
  // Check if slug already exists
  const { data: existingCouple } = await supabase
    .from('couples')
    .select('id')
    .eq('slug', slug)
    .single()
  
  if (existingCouple) {
    throw new Error('Pasangan dengan nama tersebut sudah ada')
  }
  
  const { data: couple, error: coupleError } = await supabase
    .from('couples')
    .insert({
      groom_name: request.groomName,
      bride_name: request.brideName,
      event_date: request.eventDate,
      event_time: request.eventTime,
      event_location: request.eventLocation,
      event_address: request.eventAddress,
      template_id: request.templateId,
      slug
    })
    .select()
    .single()
  
  if (coupleError) throw coupleError
  
  // Create guests
  const guests = request.guests.map(guestName => ({
    id: uuidv4(),
    couple_id: couple.id,
    name: guestName,
    slug: generateGuestSlug(guestName)
  }))
  
  const { error: guestsError } = await supabase
    .from('guests')
    .insert(guests)
  
  if (guestsError) throw guestsError
  
  return { couple: couple as Couple, guests }
}

export async function getCoupleBySlug(slug: string) {
  const { data, error } = await supabase
    .from('couples')
    .select(`
      *,
      template:templates(*)
    `)
    .eq('slug', slug)
    .single()
  
  if (error) throw error
  return data
}

export async function getCoupleById(id: string) {
  const { data, error } = await supabase
    .from('couples')
    .select(`
      *,
      template:templates(*),
      guests(*),
      payments(*)
    `)
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

// Guests
export async function getGuestBySlug(coupleSlug: string, guestSlug: string) {
  const { data, error } = await supabase
    .from('guests')
    .select(`
      *,
      couple:couples!inner(
        *,
        template:templates(*)
      )
    `)
    .eq('couple.slug', coupleSlug)
    .eq('slug', guestSlug)
    .single()
  
  if (error) throw error
  return data
}

// Payments
export async function createPayment(coupleId: string, proofImageUrl: string, amount: number = 50000) {
  const { data, error } = await supabase
    .from('payments')
    .insert({
      couple_id: coupleId,
      amount,
      proof_image_url: proofImageUrl,
      status: 'pending'
    })
    .select()
    .single()
  
  if (error) throw error
  return data as Payment
}

export async function verifyPayment(paymentId: string) {
  const { data, error } = await supabase
    .from('payments')
    .update({
      status: 'verified',
      verified_at: new Date().toISOString()
    })
    .eq('id', paymentId)
    .select()
    .single()
  
  if (error) throw error
  
  // Activate the couple's invitation
  const { error: activateError } = await supabase
    .from('couples')
    .update({
      is_active: true,
      payment_verified: true
    })
    .eq('id', (data as Payment).couple_id)
  
  if (activateError) throw activateError
  
  return data as Payment
}

// Admin functions
export async function getAllCouples() {
  const { data, error } = await supabase
    .from('couples')
    .select(`
      *,
      template:templates(*),
      guests(count),
      payments(*)
    `)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getPendingPayments() {
  const { data, error } = await supabase
    .from('payments')
    .select(`
      *,
      couple:couples(*)
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}


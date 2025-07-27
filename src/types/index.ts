export interface Couple {
  id: string
  groom_name: string
  bride_name: string
  event_date: string
  event_time: string
  event_location: string
  event_address: string
  template_id: string
  slug: string
  is_active: boolean
  payment_verified: boolean
  created_at: string
  updated_at: string
}

export interface Guest {
  id: string
  couple_id: string
  name: string
  slug: string
  created_at: string
}

export interface Payment {
  id: string
  couple_id: string
  amount: number
  proof_image_url: string
  status: 'pending' | 'verified' | 'rejected'
  verified_at?: string
  created_at: string
}

export interface Template {
  id: string
  name: string
  display_name: string
  preview_image_url: string
  folder_path: string
  is_active: boolean
  created_at: string
}

export interface InvitationData {
  couple: Couple
  guest: Guest
  template: Template
}

export interface CreateInvitationRequest {
  groomName: string
  brideName: string
  eventDate: string
  eventTime: string
  eventLocation: string
  eventAddress: string
  templateId: string
  guests: string[]
}


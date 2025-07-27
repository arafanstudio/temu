export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}

export function generateCoupleSlug(groomName: string, brideName: string): string {
  return generateSlug(`${groomName}-${brideName}`)
}

export function generateGuestSlug(guestName: string): string {
  return generateSlug(guestName)
}


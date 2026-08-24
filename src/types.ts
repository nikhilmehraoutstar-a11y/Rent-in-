export type Listing = {
  id: string
  title: string
  property_type: 'PG' | 'Room' | 'Hostel' | 'Flat'
  description: string
  area: string
  address: string
  latitude: number
  longitude: number
  rent: number | null
  available_beds: number
  contact_name: string
  contact_phone: string
  created_at: string
}

export type ListingInput = Omit<Listing, 'id' | 'created_at'>

import { FormEvent, useState } from 'react'
import MapPicker from './MapPicker'
import type { ListingInput } from '../types'

const initial = { title: '', property_type: 'PG' as const, description: '', area: '', address: '', latitude: 23.1815, longitude: 79.9864, rent: null as number | null, available_beds: 1, contact_name: '', contact_phone: '' }

export default function ListingForm({ onSubmit, saving }: { onSubmit: (listing: ListingInput) => Promise<void>; saving: boolean }) {
  const [form, setForm] = useState(initial)
  const [error, setError] = useState('')
  const update = (field: keyof typeof form, value: string | number | null) => setForm((old) => ({ ...old, [field]: value }))
  async function submit(event: FormEvent) {
    event.preventDefault(); setError('')
    if (!form.title || !form.area || !form.address || !form.description || !form.contact_name || !form.contact_phone) { setError('Please complete every required field.'); return }
    try { await onSubmit(form); setForm(initial) } catch { setError('Your listing could not be saved. Please try again.') }
  }
  return <form className="listing-form" onSubmit={submit}>
    <div className="form-grid"><label>Property name *<input required value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="e.g. Sunrise Girls PG" /></label>
      <label>Property type *<select value={form.property_type} onChange={(e) => update('property_type', e.target.value)}><option>PG</option><option>Room</option><option>Hostel</option><option>Flat</option></select></label>
      <label>Area / locality *<input required value={form.area} onChange={(e) => update('area', e.target.value)} placeholder="e.g. Vijay Nagar" /></label>
      <label>Monthly rent (₹)<input type="number" min="0" value={form.rent ?? ''} onChange={(e) => update('rent', e.target.value ? Number(e.target.value) : null)} placeholder="e.g. 6500" /></label>
      <label>Available beds *<input required type="number" min="1" value={form.available_beds} onChange={(e) => update('available_beds', Number(e.target.value))} /></label>
      <label>Contact name *<input required value={form.contact_name} onChange={(e) => update('contact_name', e.target.value)} placeholder="Your full name" /></label>
      <label className="span-two">Full address *<input required value={form.address} onChange={(e) => update('address', e.target.value)} placeholder="House number, street, landmark" /></label>
      <label className="span-two">About this place *<textarea required rows={4} value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Share key details such as sharing type, food, Wi-Fi, rules and move-in date." /></label>
      <label className="span-two">WhatsApp / phone number *<input required type="tel" value={form.contact_phone} onChange={(e) => update('contact_phone', e.target.value)} placeholder="10-digit mobile number" /></label>
    </div>
    <MapPicker value={form} onChange={(position) => setForm((old) => ({ ...old, ...position }))} />
    {error && <p className="form-error">{error}</p>}
    <button className="primary-button" disabled={saving}>{saving ? 'Publishing…' : 'Publish vacancy'}</button>
  </form>
}

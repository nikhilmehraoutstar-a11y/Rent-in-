import { useEffect, useMemo, useState } from 'react'
import ListingForm from './components/ListingForm'
import ListingMap from './components/ListingMap'
import { isSupabaseConfigured, supabase } from './lib/supabase'
import type { Listing, ListingInput } from './types'

const demoListings: Listing[] = [
  { id: 'demo-1', title: 'Sunrise Girls PG', property_type: 'PG', description: 'Near coaching centres. Double-sharing beds, food and Wi-Fi available.', area: 'Vijay Nagar', address: 'Near ISBT, Vijay Nagar, Jabalpur', latitude: 23.201, longitude: 79.950, rent: 6500, available_beds: 2, contact_name: 'Demo owner', contact_phone: '9999999999', created_at: new Date().toISOString() },
  { id: 'demo-2', title: 'Student Room Share', property_type: 'Room', description: 'A shared room for one student, close to public transport.', area: 'Gwarighat', address: 'Gwarighat Road, Jabalpur', latitude: 23.145, longitude: 79.933, rent: 4000, available_beds: 1, contact_name: 'Demo owner', contact_phone: '9999999998', created_at: new Date().toISOString() },
]

function formatRent(rent: number | null) { return rent ? `₹${rent.toLocaleString('en-IN')}/month` : 'Ask for rent' }
function directionUrl(listing: Listing) { return `https://www.google.com/maps/dir/?api=1&destination=${listing.latitude},${listing.longitude}` }
function whatsappUrl(phone: string, title: string) { return `https://wa.me/91${phone.replace(/\D/g, '').slice(-10)}?text=${encodeURIComponent(`Hi, I am interested in ${title} on RentIn Jabalpur.`)}` }

export default function App() {
  const [listings, setListings] = useState<Listing[]>([])
  const [selected, setSelected] = useState<Listing | null>(null)
  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => { void loadListings() }, [])
  async function loadListings() {
    if (!supabase) { setListings(demoListings); setLoading(false); return }
    const { data, error } = await supabase.from('listings').select('*').order('created_at', { ascending: false })
    setListings(error ? [] : (data as Listing[])); setLoading(false)
  }
  async function publish(listing: ListingInput) {
    setSaving(true)
    if (supabase) { const { error } = await supabase.from('listings').insert(listing); if (error) { setSaving(false); throw error } await loadListings() }
    else { const next = { ...listing, id: crypto.randomUUID(), created_at: new Date().toISOString() }; setListings((old) => [next, ...old]); setSelected(next) }
    setSaving(false); setShowForm(false)
  }
  const visible = useMemo(() => listings.filter((listing) => `${listing.title} ${listing.area} ${listing.property_type}`.toLowerCase().includes(query.toLowerCase())), [listings, query])
  return <>
    <header><a className="brand" href="#top">Rent<span>In</span></a><nav><a href="#find">Find rooms</a><button className="nav-cta" onClick={() => setShowForm(true)}>List a vacancy</button></nav></header>
    <main id="top">
      <section className="hero"><div><p className="eyebrow">JABALPUR STUDENT HOUSING</p><h1>Find a place.<br /><em>Feel at home.</em></h1><p className="hero-copy">A simple map of current rooms, PGs and hostel vacancies—shared directly by their owners.</p><div className="hero-actions"><a className="primary-button" href="#find">Explore the map</a><button className="secondary-button" onClick={() => setShowForm(true)}>I have a vacancy</button></div></div><div className="hero-card"><span className="pin">⌖</span><strong>Location first</strong><p>See exactly where a room is before you call.</p></div></section>
      <section id="find" className="find-section"><div className="section-heading"><div><p className="eyebrow">LIVE VACANCIES</p><h2>Rooms around Jabalpur</h2></div><label className="search"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by area or property type" /></label></div>
        {!isSupabaseConfigured && <p className="setup-note">Preview mode is active. Connect Supabase to make listings live for everyone.</p>}
        <div className="map-layout"><div className="listing-panel">{loading ? <p>Loading vacancies…</p> : visible.length === 0 ? <div className="empty"><strong>No vacancies found yet.</strong><span>Be the first owner to add one.</span></div> : visible.map((listing) => <button className={`listing-card ${selected?.id === listing.id ? 'active' : ''}`} key={listing.id} onClick={() => setSelected(listing)}><div className="card-top"><span className="tag">{listing.property_type}</span><span>{listing.available_beds} bed{listing.available_beds === 1 ? '' : 's'} free</span></div><h3>{listing.title}</h3><p>{listing.area}</p><strong>{formatRent(listing.rent)}</strong></button>)}</div><ListingMap listings={visible} selected={selected} onSelect={setSelected} /></div>
        {selected && <aside className="details"><button className="close" onClick={() => setSelected(null)} aria-label="Close details">×</button><span className="tag">{selected.property_type}</span><h2>{selected.title}</h2><p className="location">⌖ {selected.address}</p><div className="facts"><span><b>{selected.available_beds}</b> beds available</span><span><b>{formatRent(selected.rent)}</b></span></div><p>{selected.description}</p><div className="detail-actions"><a className="primary-button" target="_blank" rel="noreferrer" href={whatsappUrl(selected.contact_phone, selected.title)}>WhatsApp owner</a><a className="secondary-button" target="_blank" rel="noreferrer" href={directionUrl(selected)}>Get directions</a></div></aside>}
      </section>
    </main>
    {showForm && <div className="modal-backdrop" role="presentation"><section className="modal" role="dialog" aria-modal="true" aria-labelledby="form-title"><button className="close" onClick={() => setShowForm(false)} aria-label="Close form">×</button><p className="eyebrow">OWNER PORTAL</p><h2 id="form-title">Add your vacancy</h2><p className="form-intro">Your location pin helps students find the place confidently. You can update availability later.</p><ListingForm saving={saving} onSubmit={publish} /></section></div>}
    <footer><span>RentIn Jabalpur</span><span>Helping students find a place to stay.</span></footer>
  </>
}

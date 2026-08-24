import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet'
import { useEffect } from 'react'
import type { Listing } from '../types'

function MapFocus({ listing }: { listing: Listing | null }) {
  const map = useMap()
  useEffect(() => { if (listing) map.flyTo([listing.latitude, listing.longitude], 16) }, [listing, map])
  return null
}

export default function ListingMap({ listings, selected, onSelect }: { listings: Listing[]; selected: Listing | null; onSelect: (listing: Listing) => void }) {
  return <MapContainer center={[23.1815, 79.9864]} zoom={12} className="listing-map" scrollWheelZoom>
    <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    <MapFocus listing={selected} />
    {listings.map((listing) => <CircleMarker key={listing.id} center={[listing.latitude, listing.longitude]} radius={11} pathOptions={{ color: '#ffffff', fillColor: '#df6345', fillOpacity: 1, weight: 3 }} eventHandlers={{ click: () => onSelect(listing) }}>
      <Popup><strong>{listing.title}</strong><br />{listing.available_beds} bed{listing.available_beds === 1 ? '' : 's'} available<br /><button className="popup-button" onClick={() => onSelect(listing)}>See details</button></Popup>
    </CircleMarker>)}
  </MapContainer>
}

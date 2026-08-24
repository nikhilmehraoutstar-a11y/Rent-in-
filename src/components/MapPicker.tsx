import { useEffect } from 'react'
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet'

type Coordinates = { latitude: number; longitude: number }
const jabalpur: [number, number] = [23.1815, 79.9864]

function ClickHandler({ value, onChange }: { value: Coordinates; onChange: (next: Coordinates) => void }) {
  const map = useMap()
  useEffect(() => { map.setView([value.latitude, value.longitude], map.getZoom()) }, [map, value.latitude, value.longitude])
  useMapEvents({ click(event) { onChange({ latitude: event.latlng.lat, longitude: event.latlng.lng }) } })
  return <Marker position={[value.latitude, value.longitude]} />
}

export default function MapPicker({ value, onChange }: { value: Coordinates; onChange: (next: Coordinates) => void }) {
  function useMyLocation() {
    navigator.geolocation?.getCurrentPosition(
      (position) => onChange({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
      () => alert('We could not get your location. Please tap the exact property location on the map.'),
    )
  }
  return <div className="picker-wrap">
    <div className="map-help"><span>Tap the map to place the exact property pin.</span><button type="button" className="text-button" onClick={useMyLocation}>Use my location</button></div>
    <MapContainer center={jabalpur} zoom={13} className="picker-map" scrollWheelZoom>
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <ClickHandler value={value} onChange={onChange} />
    </MapContainer>
  </div>
}

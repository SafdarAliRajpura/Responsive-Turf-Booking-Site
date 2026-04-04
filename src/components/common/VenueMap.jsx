import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Glowing blue venue pin
const createVenuePin = () => L.divIcon({
  className: '',
  html: `
    <div style="position:relative;width:36px;height:52px;">
      <svg viewBox="0 0 36 52" fill="none" xmlns="http://www.w3.org/2000/svg"
        style="width:36px;height:52px;filter:drop-shadow(0 0 10px rgba(14,165,233,0.95)) drop-shadow(0 0 22px rgba(14,165,233,0.5))">
        <path d="M18 0C8.059 0 0 8.059 0 18c0 13 18 34 18 34S36 31 36 18C36 8.059 27.941 0 18 0z" fill="#0ea5e9"/>
        <circle cx="18" cy="18" r="8.5" fill="white" opacity="0.97"/>
        <circle cx="18" cy="18" r="5" fill="#0ea5e9"/>
      </svg>
      <div style="position:absolute;bottom:-3px;left:50%;transform:translateX(-50%);
        width:16px;height:6px;
        background:radial-gradient(ellipse,rgba(14,165,233,0.6) 0%,transparent 70%);
        border-radius:50%;"></div>
    </div>
  `,
  iconSize: [36, 52],
  iconAnchor: [18, 52],
});

const FALLBACK_CLASS =
  'w-full h-[320px] rounded-2xl border border-white/10 flex items-center justify-center bg-slate-900 text-slate-400 text-sm font-bold';

export default function VenueMap({ coordinates }) {
  const hasValidCoords =
    coordinates && coordinates.lat !== 0 && coordinates.lng !== 0;

  if (!hasValidCoords) {
    return (
      <div className={FALLBACK_CLASS}>
        <span className="opacity-50">📍 Location not available</span>
      </div>
    );
  }

  const center = [coordinates.lat, coordinates.lng];

  return (
    <div className="w-full h-[320px] rounded-2xl overflow-hidden border border-sky-400/30 shadow-[0_0_24px_rgba(14,165,233,0.15)] relative">
      <MapContainer
        center={center}
        zoom={15}
        scrollWheelZoom={false}
        dragging={false}
        zoomControl={false}
        doubleClickZoom={false}
        className="w-full h-full"
        attributionControl={false}
      >
        {/* CartoDB Voyager — vibrant Google Maps-like color style, free, no key */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {/* Soft pulsing radius ring */}
        <Circle
          center={center}
          radius={100}
          pathOptions={{
            color: '#0ea5e9',
            fillColor: '#0ea5e9',
            fillOpacity: 0.08,
            weight: 2,
            opacity: 0.5,
          }}
        />
        <Marker position={center} icon={createVenuePin()} />
      </MapContainer>

      {/* Coordinate badge */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-sky-200 text-[10px] font-bold text-slate-700 pointer-events-none flex items-center gap-2 shadow-md">
        <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse inline-block" />
        {coordinates.lat.toFixed(5)}, {coordinates.lng.toFixed(5)}
      </div>

      {/* Top label */}
      <div className="absolute top-4 right-4 z-[1000] bg-sky-500 px-3 py-1.5 rounded-lg text-[10px] font-black text-white uppercase tracking-widest pointer-events-none shadow-lg shadow-sky-500/40">
        📍 Turf Location
      </div>
    </div>
  );
}

import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Premium glowing blue venue pin
const createVenuePin = () => L.divIcon({
  className: '',
  html: `
    <div style="position:relative;width:36px;height:50px;">
      <div style="
        position:absolute;bottom:0;left:50%;transform:translateX(-50%);
        width:36px;height:48px;
      ">
        <svg viewBox="0 0 36 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;filter:drop-shadow(0 0 10px rgba(56,189,248,0.9)) drop-shadow(0 0 20px rgba(56,189,248,0.5))">
          <path d="M18 0C8.059 0 0 8.059 0 18c0 11.25 18 30 18 30S36 29.25 36 18C36 8.059 27.941 0 18 0z" fill="#38bdf8"/>
          <circle cx="18" cy="18" r="8" fill="white" opacity="0.95"/>
          <circle cx="18" cy="18" r="4.5" fill="#38bdf8"/>
        </svg>
      </div>
      <div style="
        position:absolute;bottom:-4px;left:50%;transform:translateX(-50%);
        width:18px;height:7px;
        background:radial-gradient(ellipse,rgba(56,189,248,0.5) 0%,transparent 70%);
        border-radius:50%;
      "></div>
    </div>
  `,
  iconSize: [36, 54],
  iconAnchor: [18, 54],
  popupAnchor: [0, -54],
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
    <div className="w-full h-[320px] rounded-2xl overflow-hidden border border-neon-blue/20 shadow-[0_0_30px_rgba(56,189,248,0.12)] relative">
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
        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        />
        {/* Pulsing radius ring */}
        <Circle
          center={center}
          radius={120}
          pathOptions={{
            color: '#38bdf8',
            fillColor: '#38bdf8',
            fillOpacity: 0.06,
            weight: 1.5,
            opacity: 0.4,
          }}
        />
        <Marker position={center} icon={createVenuePin()} />
      </MapContainer>

      {/* Bottom overlay badge */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-neon-blue/20 text-[10px] font-bold text-slate-300 pointer-events-none flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-neon-blue animate-pulse inline-block" />
        {coordinates.lat.toFixed(5)}, {coordinates.lng.toFixed(5)}
      </div>

      {/* Top-right label */}
      <div className="absolute top-4 right-4 z-[1000] bg-neon-blue/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-neon-blue/30 text-[10px] font-black text-neon-blue uppercase tracking-widest pointer-events-none">
        📍 Turf Location
      </div>
    </div>
  );
}

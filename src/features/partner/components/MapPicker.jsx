import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const DEFAULT_POS = { lat: 23.0225, lng: 72.5714 };

// Glowing purple pin marker
const createGlowPin = () => L.divIcon({
  className: '',
  html: `
    <div style="position:relative;width:32px;height:48px;">
      <svg viewBox="0 0 32 48" fill="none" xmlns="http://www.w3.org/2000/svg"
        style="width:32px;height:48px;filter:drop-shadow(0 0 10px rgba(168,85,247,0.95)) drop-shadow(0 0 20px rgba(168,85,247,0.5))">
        <path d="M16 0C7.163 0 0 7.163 0 16c0 11.5 16 32 16 32S32 27.5 32 16C32 7.163 24.837 0 16 0z" fill="#a855f7"/>
        <circle cx="16" cy="16" r="7.5" fill="white" opacity="0.97"/>
        <circle cx="16" cy="16" r="4.5" fill="#a855f7"/>
      </svg>
      <div style="position:absolute;bottom:-3px;left:50%;transform:translateX(-50%);
        width:14px;height:5px;
        background:radial-gradient(ellipse,rgba(168,85,247,0.6) 0%,transparent 70%);
        border-radius:50%;"></div>
    </div>
  `,
  iconSize: [32, 48],
  iconAnchor: [16, 48],
});

const LocationMarker = ({ position, setPosition, onLocationSelect }) => {
  const map = useMapEvents({
    click(e) {
      const coords = { lat: e.latlng.lat, lng: e.latlng.lng };
      setPosition(coords);
      if (onLocationSelect) onLocationSelect(coords);
      map.flyTo(e.latlng, map.getZoom(), { animate: true, duration: 0.4 });
    },
  });
  return position ? (
    <Marker
      position={[position.lat, position.lng]}
      icon={createGlowPin()}
      draggable={true}
      eventHandlers={{
        dragend(e) {
          const { lat, lng } = e.target.getLatLng();
          const coords = { lat, lng };
          setPosition(coords);
          if (onLocationSelect) onLocationSelect(coords);
        },
      }}
    />
  ) : null;
};

const ChangeView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView([center.lat, center.lng], map.getZoom());
  }, [center, map]);
  return null;
};

export default function MapPicker({ onLocationSelect, defaultPos }) {
  const [position, setPosition] = useState(defaultPos || DEFAULT_POS);

  useEffect(() => {
    if (onLocationSelect) onLocationSelect(position);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full h-[320px] rounded-2xl overflow-hidden border border-purple-400/30 shadow-[0_0_24px_rgba(168,85,247,0.18)] relative">
      <MapContainer
        center={[position.lat, position.lng]}
        zoom={14}
        scrollWheelZoom={true}
        className="w-full h-full"
        zoomControl={true}
      >
        {/* CartoDB Voyager — vibrant Google Maps-like color style, free, no key */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <LocationMarker position={position} setPosition={setPosition} onLocationSelect={onLocationSelect} />
        <ChangeView center={position} />
      </MapContainer>

      {/* Coordinate overlay */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-purple-200 text-[10px] font-bold text-slate-700 pointer-events-none flex items-center gap-2 shadow-md">
        <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse inline-block" />
        {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
      </div>

      {/* Label */}
      <div className="absolute top-4 right-4 z-[1000] bg-purple-600 px-3 py-1.5 rounded-lg text-[10px] font-black text-white uppercase tracking-widest animate-pulse pointer-events-none shadow-lg shadow-purple-500/40">
        📍 Click to Pin
      </div>
    </div>
  );
}

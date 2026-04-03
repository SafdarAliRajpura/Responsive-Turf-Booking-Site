import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const DEFAULT_POS = { lat: 23.0225, lng: 72.5714 };

// Premium glowing SVG pin marker
const createGlowPin = () => L.divIcon({
  className: '',
  html: `
    <div style="position:relative;width:32px;height:42px;">
      <div style="
        position:absolute;bottom:0;left:50%;transform:translateX(-50%);
        width:32px;height:42px;
      ">
        <svg viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;filter:drop-shadow(0 0 8px rgba(168,85,247,0.9)) drop-shadow(0 0 16px rgba(168,85,247,0.5))">
          <path d="M16 0C7.163 0 0 7.163 0 16c0 10 16 26 16 26S32 26 32 16C32 7.163 24.837 0 16 0z" fill="#a855f7"/>
          <circle cx="16" cy="16" r="7" fill="white" opacity="0.95"/>
          <circle cx="16" cy="16" r="4" fill="#a855f7"/>
        </svg>
      </div>
      <div style="
        position:absolute;bottom:-4px;left:50%;transform:translateX(-50%);
        width:16px;height:6px;
        background:radial-gradient(ellipse,rgba(168,85,247,0.5) 0%,transparent 70%);
        border-radius:50%;
      "></div>
    </div>
  `,
  iconSize: [32, 48],
  iconAnchor: [16, 48],
  popupAnchor: [0, -48],
});

const LocationMarker = ({ position, setPosition, onLocationSelect }) => {
  const map = useMapEvents({
    click(e) {
      const coords = { lat: e.latlng.lat, lng: e.latlng.lng };
      setPosition(coords);
      if (onLocationSelect) onLocationSelect(coords);
      map.flyTo(e.latlng, map.getZoom(), { animate: true, duration: 0.5 });
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
    <div className="w-full h-[320px] rounded-2xl overflow-hidden border border-neon-purple/20 shadow-[0_0_30px_rgba(168,85,247,0.15)] relative">
      <MapContainer
        center={[position.lat, position.lng]}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
        zoomControl={false}
      >
        {/* Premium dark tile — Stadia Alidade Smooth Dark */}
        <TileLayer
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        />
        <LocationMarker position={position} setPosition={setPosition} onLocationSelect={onLocationSelect} />
        <ChangeView center={position} />
      </MapContainer>

      {/* Coordinate overlay */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-neon-purple/20 text-[10px] font-bold text-slate-300 pointer-events-none flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-neon-purple animate-pulse inline-block" />
        {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
      </div>

      {/* Label */}
      <div className="absolute top-4 right-4 z-[1000] bg-neon-purple/20 backdrop-blur-md px-3 py-1.5 rounded-lg border border-neon-purple/30 text-[10px] font-black text-neon-purple uppercase tracking-widest animate-pulse pointer-events-none">
        Click Map to Pin Point
      </div>
    </div>
  );
}

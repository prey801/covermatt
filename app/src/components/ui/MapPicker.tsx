'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Next.js
const icon = L.icon({
  iconUrl: '/marker-icon.png',
  iconRetinaUrl: '/marker-icon-2x.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

// Since the marker images might not be in the public directory by default,
// fallback to a custom divIcon or emojis if needed, but let's try a custom icon
const customIcon = L.divIcon({
  html: `<div style="font-size: 24px; text-align: center; line-height: 24px;">📍</div>`,
  className: 'custom-marker',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});

interface MapPickerProps {
    onLocationSelect: (lat: number, lng: number) => void;
    defaultLat?: number;
    defaultLng?: number;
}

function LocationMarker({ onLocationSelect, position }: { onLocationSelect: (lat: number, lng: number) => void, position: L.LatLng | null }) {
    useMapEvents({
        click(e) {
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });

    return position === null ? null : (
        <Marker position={position} icon={customIcon}></Marker>
    );
}

export default function MapPicker({ onLocationSelect, defaultLat = -1.2921, defaultLng = 36.8219 }: MapPickerProps) {
    const [position, setPosition] = useState<L.LatLng | null>(null);

    const handleSelect = (lat: number, lng: number) => {
        setPosition(new L.LatLng(lat, lng));
        onLocationSelect(lat, lng);
    };

    return (
        <div className="h-[300px] w-full rounded-xl overflow-hidden shadow-inner border border-gray-200 z-0 relative">
            <MapContainer 
                center={[defaultLat, defaultLng]} 
                zoom={12} 
                scrollWheelZoom={true} 
                style={{ height: '100%', width: '100%', zIndex: 0 }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker onLocationSelect={handleSelect} position={position} />
            </MapContainer>
            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 shadow-sm border border-gray-100 z-[400] pointer-events-none">
                {position ? `Selected: ${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}` : 'Click on the map to pin your location'}
            </div>
        </div>
    );
}

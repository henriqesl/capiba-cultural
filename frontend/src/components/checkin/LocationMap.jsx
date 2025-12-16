import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl'; 
import 'mapbox-gl/dist/mapbox-gl.css'; 

mapboxgl.accessToken = 'pk.eyJ1IjoiZ3VpbW9udGVuZWdybyIsImEiOiJjbWo0d2JyaGswYXN1M2hxMjZ2ejN2dGoyIn0.fxxtwS3S493xLPud44zD3A';

export const RECIFE_BOUNDS = [
    [-35.05, -8.15], // Sudoeste (SW)
    [-34.80, -7.95]  // Nordeste (NE)
];

export const isInsideBounds = (lat, lng, bounds) => {
    const [[minLng, minLat], [maxLng, maxLat]] = bounds;
    return (
        lng >= minLng && lng <= maxLng && 
        lat >= minLat && lat <= maxLat
    );
};

const LocationMap = ({ latitude, longitude, name }) => {
    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const markerRef = useRef(null);

    useEffect(() => {
        if (!mapContainer.current) return;
        
        if (!mapRef.current) {
            const mapInstance = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [longitude, latitude],
                zoom: 15,
                maxBounds: RECIFE_BOUNDS, 
            });

            mapInstance.addControl(new mapboxgl.NavigationControl(), 'top-right');
            mapRef.current = mapInstance;
            
            markerRef.current = new mapboxgl.Marker({ color: '#E11D48' }) 
                .setLngLat([longitude, latitude])
                .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(name || 'Local Confirmado'))
                .addTo(mapRef.current);

        } else {
            mapRef.current.flyTo({ center: [longitude, latitude], zoom: 15 });
            markerRef.current.setLngLat([longitude, latitude]);
            markerRef.current.setPopup(new mapboxgl.Popup({ offset: 25 }).setText(name || 'Local Confirmado'));
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
                markerRef.current = null;
            }
        };
    }, [latitude, longitude, name]);

    return (
        <div className="rounded-xl shadow-lg mt-4 overflow-hidden" style={{ height: '250px' }}>
            <div ref={mapContainer} className="w-full h-full" />
        </div>
    );
};

export default LocationMap;
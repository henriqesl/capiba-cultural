import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiZ3VpbW9udGVuZWdybyIsImEiOiJjbWo0d2JyaGswYXN1M2hxMjZ2ejN2dGoyIn0.fxxtwS3S493xLPud44zD3A';

const EventDisplayMap = ({ latitude, longitude }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (!mapContainer.current || !latitude || !longitude) return;

    if (map.current) return; // Garante que não inicializa duas vezes

    const centerLngLat = [longitude, latitude];

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: centerLngLat,
      zoom: 15 // Um zoom bom para mostrar o local exato
    });

    // Adiciona um marcador estático
    new mapboxgl.Marker()
      .setLngLat(centerLngLat)
      .addTo(map.current);

    // Limpeza (opcional, mas boa prática)
    return () => map.current.remove(); 

  }, [latitude, longitude]); // Re-executa se as coordenadas mudarem

  return (
    <div 
      ref={mapContainer} 
      style={{ height: '300px', width: '100%', borderRadius: '8px' }} 
    />
  );
};

// Uso no componente de Detalhes:
// <EventDisplayMap latitude={evento.latitude} longitude={evento.longitude} />
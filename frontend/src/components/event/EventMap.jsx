import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { geocodeLocation } from "../../services/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

const API_URL = "http://localhost:3000";
mapboxgl.accessToken =
  "pk.eyJ1IjoiZ3VpbW9udGVuZWdybyIsImEiOiJjbWo0d2JyaGswYXN1M2hxMjZ2ejN2dGoyIn0.fxxtwS3S493xLPud44zD3A";

const EventMap = ({ events = [] }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [markersData, setMarkersData] = useState([]);
  const markersRef = useRef([]);

  useEffect(() => {
    const styleId = "mapbox-premium-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.innerHTML = `
                .mapboxgl-popup-content { 
                    border-radius: 24px !important; 
                    padding: 0 !important; 
                    box-shadow: 0 20px 40px rgba(0,0,0,0.3) !important; 
                    overflow: hidden; 
                    width: 260px;
                    border: none;
                }
                .marker-wrapper {
                    display: flex; flex-direction: column; align-items: center; cursor: pointer;
                    filter: drop-shadow(0 6px 8px rgba(0,0,0,0.3));
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .marker-wrapper:hover { transform: scale(1.2) translateY(-10px); }
                .pin-body {
                    width: 42px; height: 42px; border-radius: 21px 21px 21px 4px;
                    transform: rotate(-45deg); display: flex; align-items: center; 
                    justify-content: center; border: 3px solid white;
                }
                .pin-icon { transform: rotate(45deg); color: white; font-size: 20px; }
                .pin-shadow {
                    width: 14px; height: 5px; background: rgba(0,0,0,0.3);
                    border-radius: 50%; margin-top: 4px; filter: blur(2px);
                }
            `;
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    if (!map.current && mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [-34.8711, -8.0633],
        zoom: 13,
        pitch: 45,
        bearing: -10,
      });
    }
  }, []);

  useEffect(() => {
    const processMarkers = async () => {
      const safeEvents = Array.isArray(events) ? events : [];
      const coordsPromises = safeEvents.map(async (evento) => {
        if (evento.latitude && evento.longitude) {
          return {
            ...evento,
            latitude: parseFloat(evento.latitude),
            longitude: parseFloat(evento.longitude),
          };
        }
        if (evento.local) {
          const coords = await geocodeLocation(evento.local + ", Recife");
          return coords ? { ...evento, ...coords } : null;
        }
        return null;
      });
      const resolved = await Promise.all(coordsPromises);
      setMarkersData(resolved.filter((e) => e !== null));
    };
    processMarkers();
  }, [events]);

  useEffect(() => {
    if (!map.current) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    markersData.forEach((evento) => {
      const isUserEvent = evento.reportadoPorUsuario !== false;
      const primaryColor = isUserEvent ? "#2563eb" : "#7c3aed";
      const icon = isUserEvent ? "🎉" : "🏛️";
      const rotaDestino = isUserEvent
        ? `#/eventos/${evento.id}`
        : `#/locais/${evento.id}/mapa`;

      const imgUrl = evento.imagemUrl
        ? evento.imagemUrl.startsWith("http")
          ? evento.imagemUrl
          : `${API_URL}/${evento.imagemUrl}`
        : "https://images.unsplash.com/photo-1492684223066-81342ee5ff30";

      const el = document.createElement("div");
      el.className = "marker-wrapper";
      el.innerHTML = `
                <div class="pin-body" style="background: ${primaryColor}">
                    <span class="pin-icon">${icon}</span>
                </div>
                <div class="pin-shadow"></div>
            `;

      const popupHTML = `
                <div style="width: 100%; font-family: 'Inter', sans-serif; cursor: default;">
                    <div style="width: 100%; height: 140px; background: url('${imgUrl}') center/cover no-repeat;"></div>
                    <div style="padding: 18px;">
                        <span style="font-size: 10px; font-weight: 800; color: ${primaryColor}; text-transform: uppercase; letter-spacing: 0.5px;">
                            ${isUserEvent ? "COMUNIDADE" : "PATRIMÔNIO"}
                        </span>
                        <h4 style="margin: 6px 0 14px 0; font-size: 17px; color: #111; font-weight: 800; line-height: 1.2;">
                            ${evento.nome}
                        </h4>
                        <a href="${rotaDestino}" style="
                            display: block; width: 100%; padding: 12px; background: ${primaryColor}; color: white; 
                            text-align: center; border-radius: 14px; text-decoration: none; font-size: 13px; font-weight: 700;
                            box-shadow: 0 4px 12px ${primaryColor}44;">
                            Explorar Detalhes
                        </a>
                    </div>
                </div>
            `;

      const marker = new mapboxgl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([evento.longitude, evento.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 42, closeButton: false }).setHTML(
            popupHTML,
          ),
        )
        .addTo(map.current);

      markersRef.current.push(marker);
    });

    if (markersData.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      markersData.forEach((m) => bounds.extend([m.longitude, m.latitude]));
      map.current.fitBounds(bounds, { padding: 70, maxZoom: 15 });
    }
  }, [markersData]);

  return (
    <div className="w-full h-[600px] rounded-[3.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.15)] border-[10px] border-white overflow-hidden relative">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default EventMap;

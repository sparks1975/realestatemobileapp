import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapBoxMapProps {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  className?: string;
}

export function MapBoxMap({ 
  latitude, 
  longitude, 
  address, 
  city, 
  state, 
  zipCode,
  className = "h-[700px] w-full"
}: MapBoxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    // Check if MapBox access token is available
    const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    
    if (!accessToken) {
      console.warn('MapBox access token not found. Please add VITE_MAPBOX_ACCESS_TOKEN to your environment variables.');
      return;
    }

    if (map.current) return; // Initialize map only once

    mapboxgl.accessToken = accessToken;

    if (mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [longitude, latitude],
        zoom: 15,
        attributionControl: false
      });

      // Add a marker for the property location
      const marker = new mapboxgl.Marker({
        color: '#CBA328' // Using the gold primary color
      })
        .setLngLat([longitude, latitude])
        .addTo(map.current);

      // Add a popup with property address
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div style="padding: 10px; font-family: inherit;">
            <strong style="color: #CBA328;">${address}</strong><br/>
            ${city}, ${state} ${zipCode}
          </div>
        `);

      marker.setPopup(popup);

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add fullscreen control
      map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

      // Add 5-mile radius circle around property
      map.current.on('load', () => {
        if (!map.current) return;

        // Create a circle with 5-mile radius (8.047 km)
        const radiusInKm = 8.047; // 5 miles = 8.047 km
        const options = { steps: 80, units: 'kilometers' as const };
        
        // Create circle using turf.js-like functionality
        const createCircle = (center: [number, number], radius: number, steps: number) => {
          const coords = [];
          for (let i = 0; i < steps; i++) {
            const angle = (i * 360) / steps;
            const dx = radius * Math.cos((angle * Math.PI) / 180) / 111.32; // 1 degree = ~111.32 km
            const dy = radius * Math.sin((angle * Math.PI) / 180) / (111.32 * Math.cos((center[1] * Math.PI) / 180));
            coords.push([center[0] + dx, center[1] + dy]);
          }
          coords.push(coords[0]); // Close the polygon
          return coords;
        };

        const circleCoords = createCircle([longitude, latitude], radiusInKm, 80);

        // Add source for the circle
        map.current.addSource('radius-circle', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Polygon',
              coordinates: [circleCoords]
            }
          }
        });

        // Add fill layer for the circle
        map.current.addLayer({
          id: 'radius-fill',
          type: 'fill',
          source: 'radius-circle',
          paint: {
            'fill-color': '#CBA328',
            'fill-opacity': 0.1
          }
        });

        // Add stroke layer for the circle border
        map.current.addLayer({
          id: 'radius-stroke',
          type: 'line',
          source: 'radius-circle',
          paint: {
            'line-color': '#CBA328',
            'line-width': 2,
            'line-opacity': 0.8
          }
        });
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [latitude, longitude, address, city, state, zipCode]);

  // If no MapBox token, show fallback UI
  const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  
  if (!accessToken) {
    return (
      <div 
        className={`${className} flex items-center justify-center`}
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
      >
        <div className="text-center" style={{ color: 'var(--text-color)' }}>
          <div className="text-xl font-medium mb-2">Property Location</div>
          <p className="text-sm opacity-70">
            {address}, {city}, {state} {zipCode}
          </p>
          <p className="text-xs mt-2 opacity-50">
            MapBox integration requires an access token
          </p>
        </div>
      </div>
    );
  }

  return <div ref={mapContainer} className={className} />;
}
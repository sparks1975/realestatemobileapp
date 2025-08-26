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
  primaryColor?: string;
}

export function MapBoxMap({ 
  latitude, 
  longitude, 
  address, 
  city, 
  state, 
  zipCode,
  className = "h-[700px] w-full",
  primaryColor = "#CBA328"
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
        zoom: 11, // Reduced zoom to see the 5-mile radius better
        attributionControl: false
      });

      // Add a marker for the property location
      const marker = new mapboxgl.Marker({
        color: primaryColor // Using the dynamic primary color
      })
        .setLngLat([longitude, latitude])
        .addTo(map.current);

      // Add a popup with property address
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div style="padding: 10px; font-family: inherit;">
            <strong style="color: ${primaryColor};">${address}</strong><br/>
            ${city}, ${state} ${zipCode}
          </div>
        `);

      marker.setPopup(popup);

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add fullscreen control
      map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

      // Add 5-mile radius circle around property
      const addRadiusCircle = () => {
        if (!map.current) return;
        
        try {
          console.log('Adding 5-mile radius circle');

          // Create a circle with 5-mile radius using simple calculation
          const radiusInDegrees = 5 / 69; // Approximation: 1 degree ≈ 69 miles
          
          // Create circle coordinates
          const points = 64;
          const coordinates = [];
          
          for (let i = 0; i < points; i++) {
            const angle = (i * 360) / points;
            const x = longitude + radiusInDegrees * Math.cos((angle * Math.PI) / 180);
            const y = latitude + radiusInDegrees * Math.sin((angle * Math.PI) / 180);
            coordinates.push([x, y]);
          }
          coordinates.push(coordinates[0]); // Close the polygon

          // Add source for the circle
          map.current.addSource('radius-circle', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Polygon',
                coordinates: [coordinates]
              }
            }
          });

          // Add fill layer for the circle
          map.current.addLayer({
            id: 'radius-fill',
            type: 'fill',
            source: 'radius-circle',
            paint: {
              'fill-color': primaryColor,
              'fill-opacity': 0.15
            }
          });

          // Add stroke layer for the circle border
          map.current.addLayer({
            id: 'radius-stroke',
            type: 'line',
            source: 'radius-circle',
            paint: {
              'line-color': primaryColor,
              'line-width': 2,
              'line-opacity': 0.8
            }
          });
          
          console.log('5-mile radius circle added successfully');
        } catch (error) {
          console.error('Error adding radius circle:', error);
        }
      };

      // Try multiple approaches to ensure the circle gets added
      map.current.on('load', addRadiusCircle);
      map.current.on('style.load', addRadiusCircle);
      
      // Also try after a small delay
      setTimeout(addRadiusCircle, 1000);
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
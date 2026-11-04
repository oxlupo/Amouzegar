import { useEffect, useRef, useState } from 'react';
import type { Map as MapLibreMap } from 'maplibre-gl';
import { Map, MapMarker, MarkerContent, MarkerTooltip } from './ui/mapcn-marker-content';

interface FooterMapProps {
  /** [longitude, latitude] */
  coordinates: [number, number];
  title: string;
  address: string;
  directionsUrl: string;
}

/** How long to wait for the basemap before showing the plain fallback. */
const LOAD_TIMEOUT_MS = 8000;

/** Dark MapLibre map with the gallery pin; loaded lazily from the footer. */
export default function FooterMap({ coordinates, title, address, directionsUrl }: FooterMapProps) {
  const mapRef = useRef<MapLibreMap>(null);
  const [failed, setFailed] = useState(false);

  // If the basemap can't be reached (network, blocked CDN), don't leave a spinner forever.
  useEffect(() => {
    const timer = setTimeout(() => {
      const map = mapRef.current;
      if (!map || !map.loaded()) setFailed(true);
    }, LOAD_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, []);

  if (failed) {
    return (
      <div dir="rtl" className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-6 font-peyda">
        <span className="text-sm font-bold text-white">{title}</span>
        <span className="text-xs text-stone-400">{address}</span>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 border border-stone-600 hover:border-white px-4 py-2 text-xs font-bold text-white transition-colors"
        >
          مشاهده روی نقشه
        </a>
      </div>
    );
  }

  return (
    <Map ref={mapRef} theme="dark" center={coordinates} zoom={15} scrollZoom={false}>
      <MapMarker longitude={coordinates[0]} latitude={coordinates[1]}>
        <MarkerContent>
          <span className="relative flex size-5 items-center justify-center">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-white/40" />
            <span className="relative size-3 rounded-full border-2 border-black bg-white shadow-lg" />
          </span>
        </MarkerContent>
        <MarkerTooltip className="rounded-none bg-white text-black font-peyda text-xs px-2.5 py-1.5">
          {title}
        </MarkerTooltip>
      </MapMarker>
    </Map>
  );
}

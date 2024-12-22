import React, { useRef } from 'react';
import Mapbox, { Camera, MapView, PointAnnotation, StyleURL, SymbolLayer } from '@rnmapbox/maps';
import LineSegment from './LineSegment';
import MapMarker from './Markers/MapMarker';
import { usePreferenceStore } from '~/stores/usePreferences';

export default function MapPreview({ journey }: any) {
  const accessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error('Please provide a Mapbox access token!');
  }
  const mapTheme = usePreferenceStore((state) => state.mapTheme);
  const cameraRef = useRef<Camera>(null);
  const locations = journey.locations.sort((a: any, b: any) => a.position - b.position);
  const coordinates = locations.map((location: any) => [
    location.coordinates.longitude,
    location.coordinates.latitude,
  ]);

  const [minLon, minLat, maxLon, maxLat] = coordinates.reduce(
    (bounds: number[], [lon, lat]: any) => [
      Math.min(bounds[0], lon), // min longitude
      Math.min(bounds[1], lat), // min latitude
      Math.max(bounds[2], lon), // max longitude
      Math.max(bounds[3], lat),
    ],
    [Infinity, Infinity, -Infinity, -Infinity]
  );

  Mapbox.setAccessToken(accessToken);
  return (
    <MapView
      style={{ flex: 1 }}
      styleURL={mapTheme}
      logoEnabled={true}
      attributionEnabled={false}
      zoomEnabled={false}
      scrollEnabled={false}
      rotateEnabled={false}
      pitchEnabled={false}
      scaleBarEnabled={false}>
      <Camera
        ref={cameraRef}
        bounds={{ ne: [maxLon, maxLat], sw: [minLon, minLat] }}
        animationMode="easeTo"
        padding={{ paddingLeft: 25, paddingRight: 25, paddingTop: 25, paddingBottom: 25 }}
      />
      <LineSegment coordinates={coordinates} />
      {locations.map((location: any) => (
        <MapMarker key={location.id} location={location} />
      ))}
    </MapView>
  );
}

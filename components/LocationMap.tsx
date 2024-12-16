import Mapbox, { Camera, MapView, StyleURL } from '@rnmapbox/maps';
import React from 'react';
import MapMarker from './MapMarker';

export default function LocationMap({ location }: { location: any }) {
  const accessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error('Please provide a Mapbox access token!');
  }

  Mapbox.setAccessToken(accessToken);
  return (
    <MapView
      style={{ flex: 1 }}
      styleURL={StyleURL.Dark}
      logoEnabled={false}
      attributionEnabled={false}
      zoomEnabled={false}
      scrollEnabled={false}
      rotateEnabled={false}
      pitchEnabled={false}
      scaleBarEnabled={false}>
      <Camera
        animationMode="easeTo"
        centerCoordinate={[location.coordinates.longitude, location.coordinates.latitude]}
        zoomLevel={11}
      />
      <MapMarker key={location.id} location={location} hidden={location.hideLocation} />
    </MapView>
  );
}

import { View, Text } from 'react-native';
import React from 'react';
import Mapbox, { Camera, LocationPuck, MapView, PointAnnotation, StyleURL } from '@rnmapbox/maps';

export default function Map() {
  const accessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error('Please provide a Mapbox access token');
  }

  Mapbox.setAccessToken(accessToken);
  return (
    <MapView
      style={{ flex: 1 }}
      styleURL={StyleURL.Light}
      logoEnabled={false}
      attributionEnabled={false}
      attributionPosition={{ top: 8, left: 8 }}>
      <Camera followUserLocation followZoomLevel={10} animationMode="easeTo" />
      <LocationPuck puckBearingEnabled puckBearing="heading" pulsing={{ isEnabled: true }} />
    </MapView>
  );
}

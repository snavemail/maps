import Mapbox, { Camera, MapView } from '@rnmapbox/maps';
import React from 'react';
import MapMarker from '~/components/Maps/Markers/MapMarker';
import { usePreferenceStore } from '~/stores/usePreferences';
import { View } from 'react-native';

export default function LocationMap({
  location,
  logoEnabled = false,
  animationDuration = 800,
}: {
  location: any;
  animationDuration?: number;
  logoEnabled?: boolean;
}) {
  const mapTheme = usePreferenceStore((state) => state.mapTheme);
  const accessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error('Please provide a Mapbox access token!');
  }

  Mapbox.setAccessToken(accessToken);
  return (
    <View className="flex-1">
      <MapView
        style={{ flex: 1 }}
        styleURL={mapTheme}
        logoEnabled={logoEnabled}
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
          animationDuration={animationDuration}
        />
        <MapMarker key={location.id} location={location} hidden={location.hideLocation} />
      </MapView>
      <View className="absolute bottom-0 left-0 right-0 top-0 z-50 bg-transparent" />
    </View>
  );
}

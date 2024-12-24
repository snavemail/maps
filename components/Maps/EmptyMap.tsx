import React from 'react';
import Mapbox, { Camera, LocationPuck, MapView } from '@rnmapbox/maps';
import { View, useWindowDimensions } from 'react-native';
import JourneyMapButton from '~/components/Buttons/JourneyMapButton';

import { usePreferenceStore } from '~/stores/usePreferences';
import { useUserLocationStore } from '~/stores/useUserLocation';
import { centerOnUser } from '~/utils/MapBox';

export default function EmptyMap() {
  const accessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const mapTheme = usePreferenceStore((state) => state.mapTheme);

  if (!accessToken) {
    throw new Error('Please provide a Mapbox access token');
  }

  const cameraRef = React.useRef<Camera>(null);
  const { height } = useWindowDimensions();

  const userLocation = useUserLocationStore((state) => state.userLocation);

  Mapbox.setAccessToken(accessToken);
  return (
    <>
      <View className="absolute right-8 top-20 z-50 items-center gap-4">
        <JourneyMapButton
          iconName="LocateFixed"
          onPress={async () => {
            centerOnUser({
              userLocation: {
                latitude: userLocation?.lat!,
                longitude: userLocation?.lon!,
              },
              cameraRef,
            });
          }}
        />
      </View>
      <MapView
        style={{ flex: 1, opacity: 1 }}
        styleURL={mapTheme}
        logoEnabled={true}
        compassEnabled={false}
        attributionEnabled={true}
        logoPosition={{ top: 64, left: 8 }}
        attributionPosition={{ top: 64, left: 100 }}
        scaleBarEnabled={false}>
        <Camera ref={cameraRef} followUserLocation followZoomLevel={13} animationMode="none" />
        <LocationPuck
          puckBearingEnabled
          puckBearing="heading"
          pulsing={{ isEnabled: true, color: '#0fa00f' }}
        />
      </MapView>
    </>
  );
}

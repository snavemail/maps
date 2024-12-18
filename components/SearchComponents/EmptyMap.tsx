import React, { useCallback, useEffect, useState } from 'react';
import Mapbox, { Camera, FillLayer, LocationPuck, MapView, StyleURL } from '@rnmapbox/maps';
import { Pressable, View, useWindowDimensions, Text } from 'react-native';

import JourneyMapButton from '~/components/JourneyMapButton';
import * as Location from 'expo-location';
import { centerOnCoordinates, centerOnUser, getBounds } from '~/utils/MapBox';
import SearchMapMarker from './SearchMapMarker';
import { FontAwesome } from '@expo/vector-icons';
import { useSearchStore } from '~/stores/useSearch';
import { debounce } from 'lodash';
import { usePreferenceStore } from '~/stores/usePreferences';
import { results } from '~/data/poi';
import { useUserLocationStore } from '~/stores/useUserLocation';

export default function EmptyMap() {
  const accessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const mapTheme = usePreferenceStore((state) => state.mapTheme);

  if (!accessToken) {
    throw new Error('Please provide a Mapbox access token');
  }

  const cameraRef = React.useRef<Camera>(null);
  const { height } = useWindowDimensions();

  const userLocation = useUserLocationStore((state) => state.userLocation);

  const PADDINGCONFIG = [80, 30, 80, 30]; //top, right, bottom, left

  Mapbox.setAccessToken(accessToken);
  return (
    <>
      <View className="absolute right-8 top-20 z-50 items-center gap-4">
        <JourneyMapButton
          iconName="crosshairs"
          onPress={async () => {
            centerOnUser({
              userLocation: {
                latitude: userLocation?.lat!,
                longitude: userLocation?.lon!,
              },
              cameraRef,
              paddingConfig: PADDINGCONFIG,
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
        logoPosition={{ bottom: height - 180, left: 8 }}
        attributionPosition={{ bottom: height - 180, left: 91 }}
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

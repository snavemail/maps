import React, { useCallback, useEffect, useState } from 'react';
import Mapbox, { Camera, LocationPuck, MapView } from '@rnmapbox/maps';
import { Pressable, View, useWindowDimensions, Text } from 'react-native';

import JourneyMapButton from '~/components/Buttons/JourneyMapButton';
import { centerOnLocation, getBounds } from '~/utils/MapBox';
import SearchMapMarker from '~/components/Maps/Markers/SearchMapMarker';
import { FontAwesome } from '@expo/vector-icons';
import { useCategoryStore } from '~/stores/useSearch';
import { debounce } from 'lodash';
import { usePreferenceStore } from '~/stores/usePreferences';
import { useUserLocationStore } from '~/stores/useUserLocation';
import { PADDINGCONFIG } from '~/constants/mapbox';

export default function SearchMap({ results }: { results: LocationResult[] }) {
  const accessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const mapTheme = usePreferenceStore((state) => state.mapTheme);
  if (!accessToken) {
    throw new Error('Please provide a Mapbox access token');
  }
  const setSelectedResult = useCategoryStore((state) => state.setSelectedResult);
  const userLocation = useUserLocationStore((state) => state.userLocation);
  const cameraRef = React.useRef<Camera>(null);

  const initialCameraPosition = userLocation
    ? {
        centerCoordinate: [userLocation.lon, userLocation.lat],
        zoomLevel: 13,
      }
    : null;

  const centerOnCoords = (animationDuration = 0) => {
    if (results.length === 0) return;

    const bounds = getBounds({
      coordinates: results.map((marker) => [
        marker.properties.coordinates.longitude,
        marker.properties.coordinates.latitude,
      ]),
    });
    cameraRef.current?.fitBounds(
      [bounds.maxLon, bounds.maxLat],
      [bounds.minLon, bounds.minLat],
      PADDINGCONFIG,
      animationDuration
    );
  };

  Mapbox.setAccessToken(accessToken);
  return (
    <>
      <View className="absolute right-8 top-16 z-50 items-center gap-4">
        <JourneyMapButton
          iconName="LocateFixed"
          onPress={() => {
            centerOnLocation({
              location: {
                latitude: userLocation?.lat!,
                longitude: userLocation?.lon!,
              },
              cameraRef,
            });
          }}
        />
        <JourneyMapButton iconName="MapPin" onPress={() => centerOnCoords(800)} />
      </View>
      {/*
        <View className="absolute top-20 z-50 flex w-fit flex-row items-center gap-2 rounded-lg border border-black bg-white px-3 py-2">
          <Pressable className="flex flex-row items-center justify-center gap-2">
            <FontAwesome name="search" size={12} color="black" />
            <Text className="text-lg font-semibold">Search Here</Text>
          </Pressable>
        </View>
      */}
      <MapView
        onPress={() => setSelectedResult(null)}
        style={{ flex: 1, opacity: 1 }}
        styleURL={mapTheme}
        logoEnabled={true}
        compassEnabled={false}
        attributionEnabled={true}
        compassViewPosition={0}
        logoPosition={{ top: 64, left: 8 }}
        attributionPosition={{ top: 80, left: 0 }}
        scaleBarEnabled={false}
        onCameraChanged={(e) => {}}>
        {initialCameraPosition && (
          <Camera
            ref={cameraRef}
            followZoomLevel={13}
            animationMode="none"
            {...initialCameraPosition}
          />
        )}
        <LocationPuck
          puckBearingEnabled
          puckBearing="heading"
          pulsing={{ isEnabled: true, color: '#0fa00f' }}
        />
        <SearchMapMarker locations={results} cameraRef={cameraRef} />
      </MapView>
    </>
  );
}

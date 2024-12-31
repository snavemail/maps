import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Mapbox, { Camera, LocationPuck, MapView } from '@rnmapbox/maps';
import { Pressable, View, useWindowDimensions, Text } from 'react-native';

import JourneyMapButton from '~/components/Buttons/JourneyMapButton';
import { centerOnLocation, diffBBox, getBounds } from '~/utils/MapBox';
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

  const setCurrentBBox = useCategoryStore((state) => state.setCurrentBBox);
  const currentBBox = useCategoryStore((state) => state.currentBBox);
  const fetchBBoxResults = useCategoryStore((state) => state.fetchBBoxResults);
  const currentCategory = useCategoryStore((state) => state.currentCategory);

  const initialCameraPosition = userLocation
    ? {
        centerCoordinate: [userLocation.lon, userLocation.lat],
        zoomLevel: 13,
      }
    : null;

  const bounds = useMemo(
    () =>
      getBounds({
        coordinates: results.map((marker) => [
          marker.properties.coordinates.longitude,
          marker.properties.coordinates.latitude,
        ]),
      }),
    [results]
  );

  const centerOnCoords = (animationDuration = 0) => {
    if (results.length === 0) return;

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
      {!currentCategory &&
        diffBBox(
          currentBBox,
          getBounds({
            coordinates: results.map((marker) => [
              marker.properties.coordinates.longitude,
              marker.properties.coordinates.latitude,
            ]),
          })
        ) && (
          <View
            style={{
              position: 'absolute',
              left: '50%',
              top: 100,
              zIndex: 50,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: 'black',
              backgroundColor: 'white',
              paddingHorizontal: 12,
              paddingVertical: 8,
              transform: [{ translateX: -44 }],
            }}>
            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: 88,
              }}>
              <Text style={{ fontSize: 14, fontWeight: '600' }}>Search Here</Text>
            </Pressable>
          </View>
        )}

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

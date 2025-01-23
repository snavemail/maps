import React, { useCallback, useMemo, useState } from 'react';
import Mapbox, { Camera, LocationPuck, MapView } from '@rnmapbox/maps';
import { Pressable, View, Text } from 'react-native';
import SearchMapMarker from '~/components/Maps/Markers/SearchMapMarker';
import { useCategoryStore } from '~/stores/useSearch';
import { debounce } from 'lodash';
import { useUserLocationStore } from '~/stores/useUserLocation';
import { PADDINGCONFIG } from '~/constants/mapbox';
import { usePreferenceStore } from '~/stores/usePreferences';
import { getBounds, centerOnLocation } from '~/utils/MapBox';
import JourneyMapButton from '../Buttons/JourneyMapButton';

export default function SearchMap({ results }: { results: LocationResult[] }) {
  const accessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const mapTheme = usePreferenceStore((state) => state.mapTheme);
  if (!accessToken) {
    throw new Error('Please provide a Mapbox access token');
  }
  const setSelectedResult = useCategoryStore((state) => state.setSelectedResult);
  const userLocation = useUserLocationStore((state) => state.userLocation);
  const cameraRef = React.useRef<Camera>(null);

  const currentCategory = useCategoryStore((state) => state.currentCategory);
  const fetchCategoryResultsByBbox = useCategoryStore((state) => state.fetchCategoryResultsByBbox);
  const lastSearchedBbox = useCategoryStore((state) => state.lastSearchedBbox);
  const [currentBbox, setCurrentBbox] = useState<[number, number, number, number] | null>(null);

  const handleCameraChanged = useCallback(
    debounce((e) => {
      const bounds = e.properties.bounds;
      setCurrentBbox([
        bounds.sw[0], // minLon
        bounds.sw[1], // minLat
        bounds.ne[0], // maxLon
        bounds.ne[1], // maxLat
      ]);
    }),
    []
  );

  const isSearchHereVisible = useCallback(() => {
    if (!currentCategory || !currentBbox || !lastSearchedBbox) return false;

    const threshold = 0.02;
    return (
      Math.abs(currentBbox[0] - lastSearchedBbox[0]) > threshold ||
      Math.abs(currentBbox[1] - lastSearchedBbox[1]) > threshold ||
      Math.abs(currentBbox[2] - lastSearchedBbox[2]) > threshold ||
      Math.abs(currentBbox[3] - lastSearchedBbox[3]) > threshold
    );
  }, [currentCategory, currentBbox, lastSearchedBbox]);

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
      {isSearchHereVisible() && (
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
            }}
            onPress={() => {
              if (currentCategory && currentBbox) {
                fetchCategoryResultsByBbox(currentCategory, currentBbox);
              }
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
        onCameraChanged={handleCameraChanged}>
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

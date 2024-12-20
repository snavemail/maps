import React, { useCallback, useEffect, useState } from 'react';
import Mapbox, { Camera, LocationPuck, MapView } from '@rnmapbox/maps';
import { Pressable, View, useWindowDimensions, Text } from 'react-native';

import JourneyMapButton from '~/components/JourneyMapButton';
import { centerOnUser, getBounds } from '~/utils/MapBox';
import SearchMapMarker from '~/components/SearchComponents/SearchMapMarker';
import { FontAwesome } from '@expo/vector-icons';
import { useSearchStore } from '~/stores/useSearch';
import { debounce } from 'lodash';
import { usePreferenceStore } from '~/stores/usePreferences';
import EmptyMap from '../Maps/EmptyMap';
import { useUserLocationStore } from '~/stores/useUserLocation';
import { PADDINGCONFIG } from '~/constants/mapbox';

export default function SearchMap({ results }: { results: LocationResult[] }) {
  const accessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const mapTheme = usePreferenceStore((state) => state.mapTheme);

  if (!accessToken) {
    throw new Error('Please provide a Mapbox access token');
  }

  const [loaded, setLoaded] = useState(false);
  const setSelectedResult = useSearchStore((state) => state.setSelectedResult);
  const currentBBox = useSearchStore((state) => state.currentBBox);
  const setCurrentBBox = useSearchStore((state) => state.setCurrentBBox);
  const isSearchButtonVisible = useSearchStore((state) => state.isSearchButtonVisible);
  const setSearchButtonVisibility = useSearchStore((state) => state.setSearchButtonVisibility);
  const userLocation = useUserLocationStore((state) => state.userLocation);

  const cameraRef = React.useRef<Camera>(null);
  const BBOX_PADDING = 0.1; // 10% padding
  const SIGNIFICANT_CHANGE_THRESHOLD = 1; // 30% change threshold
  const { height } = useWindowDimensions();

  const initialBounds =
    results.length > 0
      ? getBounds({
          coordinates: results.map((marker) => [
            marker.properties.coordinates.longitude,
            marker.properties.coordinates.latitude,
          ]),
        })
      : null;

  const initialCameraPosition = initialBounds
    ? {
        centerCoordinate: [
          (initialBounds.minLon + initialBounds.maxLon) / 2,
          (initialBounds.minLat + initialBounds.maxLat) / 2,
        ],
        zoomLevel: 11,
      }
    : null;

  useEffect(() => {
    if (loaded && results.length > 0) {
      centerOnCoords();
    } else {
      centerOnUser({
        userLocation: {
          latitude: userLocation?.lat!,
          longitude: userLocation?.lon!,
        },
        cameraRef,
        animationDuration: 800,
      });
    }
  }, [loaded, results]);

  useEffect(() => {
    calculateBBox();
  }, [results]);

  const calculateBBox = () => {
    const bounds = getBounds({
      coordinates: results.map((marker) => [
        marker.properties.coordinates.longitude,
        marker.properties.coordinates.latitude,
      ]),
    });

    const paddedBBox = {
      minLon: bounds.minLon - (bounds.maxLon - bounds.minLon) * BBOX_PADDING,
      maxLon: bounds.maxLon + (bounds.maxLon - bounds.minLon) * BBOX_PADDING,
      minLat: bounds.minLat - (bounds.maxLat - bounds.minLat) * BBOX_PADDING,
      maxLat: bounds.maxLat + (bounds.maxLat - bounds.minLat) * BBOX_PADDING,
    };

    setCurrentBBox(paddedBBox);
  };

  const checkViewportChange = useCallback(
    debounce((newBBox) => {
      if (!currentBBox) return;

      const currentWidth = currentBBox.maxLon - currentBBox.minLon;
      const currentHeight = currentBBox.maxLat - currentBBox.minLat;
      const newWidth = newBBox.maxLon - newBBox.minLon;
      const newHeight = newBBox.maxLat - newBBox.minLat;

      const widthChange = Math.abs(newWidth - currentWidth) / currentWidth;
      const heightChange = Math.abs(newHeight - currentHeight) / currentHeight;
      const centerShift =
        Math.abs(newBBox.minLon + newWidth / 2 - (currentBBox.minLon + currentWidth / 2)) /
        currentWidth;

      if (
        widthChange > SIGNIFICANT_CHANGE_THRESHOLD ||
        heightChange > SIGNIFICANT_CHANGE_THRESHOLD ||
        centerShift > SIGNIFICANT_CHANGE_THRESHOLD
      ) {
        console.log('Significant change detected');
        // setSearchButtonVisibility(true);
      } else {
        console.log('We are close to original location');
        // setSearchButtonVisibility
      }
    }, 300),
    [currentBBox]
  );

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
          iconName="crosshairs"
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
        <JourneyMapButton iconName="map-marker" onPress={() => centerOnCoords(800)} />
      </View>
      {isSearchButtonVisible && (
        <View className="absolute top-20 z-50 flex w-fit flex-row items-center gap-2 rounded-lg border border-black bg-white px-3 py-2">
          <Pressable className="flex flex-row items-center justify-center gap-2">
            <FontAwesome name="search" size={12} color="black" />
            <Text className="text-lg font-semibold">Search Here</Text>
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
        logoPosition={{ top: 64, left: 8 }}
        attributionPosition={{ top: 64, left: 100 }}
        scaleBarEnabled={false}
        onDidFinishLoadingMap={() => {
          setLoaded(true);
        }}
        onCameraChanged={(e) => {
          const newBBox = {
            minLon: e.properties.bounds.sw[0],
            minLat: e.properties.bounds.sw[1],
            maxLon: e.properties.bounds.ne[0],
            maxLat: e.properties.bounds.ne[1],
          };
          checkViewportChange(newBBox);
        }}>
        {initialCameraPosition && (
          <Camera
            ref={cameraRef}
            followZoomLevel={13}
            animationMode="none"
            zoomLevel={initialCameraPosition.zoomLevel}
            centerCoordinate={initialCameraPosition.centerCoordinate}
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

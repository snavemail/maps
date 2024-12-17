import React, { useCallback, useEffect, useState } from 'react';
import Mapbox, { Camera, LocationPuck, MapView } from '@rnmapbox/maps';
import { Pressable, View, useWindowDimensions, Text } from 'react-native';

import JourneyMapButton from '~/components/JourneyMapButton';
import * as Location from 'expo-location';
import { centerOnCoordinates, centerOnUser, getBounds } from '~/utils/MapBox';
import SearchMapMarker from './SearchMapMarker';
import { FontAwesome } from '@expo/vector-icons';
import { useSearchStore } from '~/stores/useSearch';
import { debounce } from 'lodash';

export default function SearchMap({ results }: { results: LocationResult[] }) {
  const accessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error('Please provide a Mapbox access token');
  }

  const [loaded, setLoaded] = useState(false);
  const currentBBox = useSearchStore((state) => state.currentBBox);
  const setCurrentBBox = useSearchStore((state) => state.setCurrentBBox);
  const setSearchButtonVisibility = useSearchStore((state) => state.setSearchButtonVisible);

  const cameraRef = React.useRef<Camera>(null);
  const BBOX_PADDING = 0.1; // 10% padding
  const SIGNIFICANT_CHANGE_THRESHOLD = 0.3; // 30% change threshold
  const { height } = useWindowDimensions();

  const PADDINGCONFIG = [30, 30, 150, 30]; //top, right, bottom, left

  useEffect(() => {
    centerOnCoords();
  }, [loaded]);

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
        setSearchButtonVisibility(true);
      }
    }, 300),
    [currentBBox]
  );

  const centerOnCoords = () => {
    const bounds = getBounds({
      coordinates: results.map((marker) => [
        marker.properties.coordinates.longitude,
        marker.properties.coordinates.latitude,
      ]),
    });
    centerOnCoordinates({
      minLon: bounds.minLon,
      minLat: bounds.minLat,
      maxLon: bounds.maxLon,
      maxLat: bounds.maxLat,
      cameraRef,
      paddingConfig: PADDINGCONFIG,
    });
  };

  const updateUserLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      return location.coords;
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  };

  Mapbox.setAccessToken(accessToken);
  return (
    <>
      <View className="absolute right-8 top-20 z-50 items-center gap-4">
        <JourneyMapButton
          iconName="crosshairs"
          onPress={async () => {
            const location = await updateUserLocation();
            centerOnUser({ userLocation: location, cameraRef, paddingConfig: PADDINGCONFIG });
          }}
        />
        <JourneyMapButton iconName="map-marker" onPress={centerOnCoords} />
      </View>
      <View className="absolute top-20 z-50 flex w-fit flex-row items-center gap-2 rounded-lg border border-black bg-white px-3 py-2">
        <Pressable className="flex flex-row items-center justify-center gap-2">
          <FontAwesome name="search" size={12} color="black" />
          <Text className="text-lg font-semibold">Search Here</Text>
        </Pressable>
      </View>
      <MapView
        style={{ flex: 1, opacity: 1 }}
        tintColor={'red'}
        styleURL={'mapbox://styles/mapbox/dark-v11'}
        logoEnabled={true}
        compassEnabled={false}
        attributionEnabled={true}
        logoPosition={{ bottom: height - 180, left: 8 }}
        attributionPosition={{ bottom: height - 180, left: 91 }}
        scaleBarEnabled={false}
        onDidFinishLoadingMap={() => setLoaded(true)}
        onRegionDidChange={(e) => {
          console.log('Map idle');
          // const newBBox = {
          //   minLon: bounds[0][0],
          //   minLat: bounds[0][1],
          //   maxLon: bounds[1][0],
          //   maxLat: bounds[1][1],
          // };
          // checkViewportChange(newBBox);
        }}>
        <Camera ref={cameraRef} followZoomLevel={13} animationMode="none" />
        <LocationPuck
          puckBearingEnabled
          puckBearing="heading"
          pulsing={{ isEnabled: true, color: '#0fa00f' }}
        />
        <SearchMapMarker locations={results} onMarkerPress={(id) => console.log('Pressed:', id)} />
      </MapView>
    </>
  );
}

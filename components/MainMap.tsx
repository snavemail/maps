import React, { useEffect, useState, useMemo } from 'react';
import Mapbox, { Camera, LocationPuck, MapView, StyleURL } from '@rnmapbox/maps';
import { useJourneyStore } from '~/stores/useJourney';
import MapMarker from './MapMarker';
import { View, Pressable, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getCurrentLocation, getTitle } from '~/lib/utils';
import LineSegment from './LineSegment';
import JourneyMapButton from './JourneyMapButton';
import * as Location from 'expo-location';
import { centerOnCoordinates, centerOnUser, centerOnUserReset, getBounds } from '~/utils/MapBox';

export default function MainMap() {
  const accessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error('Please provide a Mapbox access token');
  }

  const cameraRef = React.useRef<Camera>(null);

  const draftJourney = useJourneyStore((state) => state.draftJourney);
  const startJourney = useJourneyStore((state) => state.startJourney);
  const PADDINGCONFIG = [88, 50, 333, 50]; //top, right, bottom, left
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const locations =
    draftJourney?.locations.sort(
      (a: DraftLocation, b: DraftLocation) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    ) || [];

  const coordinates = useMemo(
    () =>
      locations.map((location: DraftLocation) => [
        location.coordinates.longitude,
        location.coordinates.latitude,
      ]),
    [locations]
  );

  const coordinatesWithUser = useMemo(
    () =>
      userLocation
        ? [[userLocation.longitude, userLocation.latitude], ...coordinates]
        : coordinates,
    [coordinates, userLocation]
  );

  const bounds = useMemo(() => getBounds({ coordinates }), [coordinates]);
  const boundsWithUser = useMemo(
    () => getBounds({ coordinates: coordinatesWithUser }),
    [coordinatesWithUser, userLocation, coordinates]
  );

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      if (locations.length === 0 && cameraRef.current) {
        centerOnUserReset({
          userLocation: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          cameraRef,
          paddingConfig: PADDINGCONFIG,
          animationDuration: 0,
        });
      } else if (locations.length > 0 && cameraRef.current) {
        centerOnCoordinates({
          minLon: bounds.minLon,
          minLat: bounds.minLat,
          maxLon: bounds.maxLon,
          maxLat: bounds.maxLat,
          cameraRef,
          paddingConfig: PADDINGCONFIG,
        });
      }
    })();
  }, []);

  const updateUserLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
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
        <JourneyMapButton
          iconName="map-pin"
          onPress={() => {
            if (coordinates.length > 0) {
              centerOnCoordinates({
                minLon: bounds.minLon,
                minLat: bounds.minLat,
                maxLon: bounds.maxLon,
                maxLat: bounds.maxLat,
                cameraRef,
                paddingConfig: PADDINGCONFIG,
              });
            }
          }}
        />
        <JourneyMapButton
          iconName="globe"
          onPress={async () => {
            const location = await updateUserLocation();
            const newCoords = [[location?.longitude, location?.latitude], ...coordinates];
            const boundsWithUser = getBounds({ coordinates: newCoords as number[][] });
            coordinates.length > 0
              ? centerOnCoordinates({
                  minLon: boundsWithUser.minLon,
                  minLat: boundsWithUser.minLat,
                  maxLon: boundsWithUser.maxLon,
                  maxLat: boundsWithUser.maxLat,
                  cameraRef,
                  paddingConfig: PADDINGCONFIG,
                })
              : centerOnUser({ userLocation: location, cameraRef, paddingConfig: PADDINGCONFIG });
          }}
          iconSize={24}
        />
      </View>
      {!draftJourney && (
        <View className="absolute bottom-8 right-8 z-50 active:scale-90 ">
          <Pressable
            disabled={draftJourney}
            hitSlop={10}
            onPress={async () => {
              const address = await getCurrentLocation();
              if (!address) return;
              const title = getTitle({ isJourney: true, address: address.address });
              startJourney(title);
            }}
            className="flex flex-row items-center justify-center gap-2 rounded-full bg-white p-4">
            <FontAwesome name="plus-circle" size={19} color="black" />
            <Text className="text-black">Start Journey</Text>
          </Pressable>
        </View>
      )}

      <MapView
        style={{ flex: 1 }}
        tintColor={'red'}
        styleURL={StyleURL.Dark}
        logoEnabled={true}
        compassEnabled={false}
        attributionEnabled={true}
        attributionPosition={{ top: 8, left: 8 }}
        scaleBarEnabled={false}>
        <Camera ref={cameraRef} followZoomLevel={13} animationMode="none" />
        <LocationPuck
          puckBearingEnabled
          puckBearing="heading"
          pulsing={{ isEnabled: true, color: '#0fa00f' }}
        />
        <LineSegment coordinates={coordinates} />
        {locations.map((location) => (
          <MapMarker key={location.id} location={location} />
        ))}
      </MapView>
    </>
  );
}

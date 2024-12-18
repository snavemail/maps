import React, { useEffect, useState, useMemo } from 'react';
import Mapbox, { Camera, LocationPuck, MapView, StyleURL } from '@rnmapbox/maps';
import { useJourneyStore } from '~/stores/useJourney';
import MapMarker from './MapMarker';
import { View, Pressable, Text, useWindowDimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getCurrentLocation, getTitle } from '~/lib/utils';
import LineSegment from './LineSegment';
import JourneyMapButton from './JourneyMapButton';
import * as Location from 'expo-location';
import { centerOnCoordinates, centerOnUser, getBounds } from '~/utils/MapBox';
import { usePreferenceStore } from '~/stores/usePreferences';
import { useUserLocationStore } from '~/stores/useUserLocation';

export default function MainMap() {
  const accessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error('Please provide a Mapbox access token');
  }

  const mapTheme = usePreferenceStore((state) => state.mapTheme);
  const cameraRef = React.useRef<Camera>(null);
  const { height } = useWindowDimensions();

  const draftJourney = useJourneyStore((state) => state.draftJourney);
  const startJourney = useJourneyStore((state) => state.startJourney);
  const userLocation = useUserLocationStore((state) => state.userLocation);
  const [loaded, setLoaded] = useState(false);

  const PADDINGCONFIG = [80, 30, 100, 30]; //top, right, bottom, left

  const initialCameraPosition = userLocation
    ? {
        centerCoordinate: [userLocation.lon, userLocation.lat],
        zoomLevel: 13,
      }
    : null;

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

  const bounds = useMemo(() => getBounds({ coordinates }), [coordinates]);

  useEffect(() => {
    if (locations.length === 0 && loaded) {
      centerOnUser({
        userLocation: {
          latitude: userLocation?.lat!,
          longitude: userLocation?.lon!,
        },
        cameraRef,
        paddingConfig: PADDINGCONFIG,
        animationDuration: 0,
      });
    } else if (locations.length > 0 && loaded) {
      centerOnCoordinates({
        minLon: bounds.minLon,
        minLat: bounds.minLat,
        maxLon: bounds.maxLon,
        maxLat: bounds.maxLat,
        cameraRef,
        paddingConfig: PADDINGCONFIG,
      });
    }
  }, [cameraRef, bounds, userLocation, loaded]);

  Mapbox.setAccessToken(accessToken);
  return (
    <>
      <View className="absolute right-8 top-16 z-50 items-center gap-4 ">
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
        <JourneyMapButton
          iconName="map-marker"
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
            } else {
              centerOnUser({
                userLocation: {
                  latitude: userLocation?.lat!,
                  longitude: userLocation?.lon!,
                },
                cameraRef,
                paddingConfig: PADDINGCONFIG,
              });
            }
          }}
        />
        <JourneyMapButton
          iconName="globe"
          onPress={() => {
            cameraRef.current?.setCamera({
              zoomLevel: 2,
              centerCoordinate: [userLocation?.lon!, userLocation?.lat!],
            });
          }}
          iconSize={24}
        />
      </View>
      {!draftJourney && (
        <Pressable
          disabled={draftJourney}
          hitSlop={10}
          className="absolute bottom-8 right-8 z-50 active:scale-95"
          onPress={async () => {
            const address = await getCurrentLocation();
            if (!address) return;
            const title = getTitle({ isJourney: true, address: address.address });
            startJourney(title);
          }}>
          <View className="flex flex-row items-center justify-center gap-2 rounded-lg border-2 bg-white px-3 py-2">
            <FontAwesome name="plus-circle" size={19} color="black" />
            <Text className="text-lg font-semibold">Start Journey</Text>
          </View>
        </Pressable>
      )}

      <MapView
        projection="globe"
        style={{ flex: 1 }}
        styleURL={mapTheme}
        logoEnabled={true}
        compassEnabled={false}
        attributionEnabled={true}
        logoPosition={{ top: 64, left: 8 }}
        attributionPosition={{ top: 64, left: 91 }}
        onDidFinishLoadingMap={() => {
          setLoaded(true);
        }}
        scaleBarEnabled={false}>
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
        <LineSegment coordinates={coordinates} />
        {locations.map((location) => (
          <MapMarker key={location.id} location={location} />
        ))}
      </MapView>
    </>
  );
}

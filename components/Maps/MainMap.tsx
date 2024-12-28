import React, { useEffect, useState, useMemo } from 'react';
import Mapbox, { Camera, LocationPuck, MapView } from '@rnmapbox/maps';
import { useJourneyStore } from '~/stores/useJourney';
import { View, Pressable, Text } from 'react-native';
import { PlaneTakeoff } from 'lucide-react-native';
import LineSegment from './LineSegment';
import JourneyMapButton from '~/components/Buttons/JourneyMapButton';
import { centerOnCoordinates, centerOnLocation, getBounds } from '~/utils/MapBox';
import { usePreferenceStore } from '~/stores/usePreferences';
import { useUserLocationStore } from '~/stores/useUserLocation';
import { PADDINGCONFIG } from '~/constants/mapbox';
import { useRouter } from 'expo-router';
import MainMapMarker from './Markers/MainMapMarker';
import { useColorScheme } from 'nativewind';

export default function MainMap({ cameraRef }: { cameraRef: React.RefObject<Camera> }) {
  const accessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error('Please provide a Mapbox access token');
  }

  const { colorScheme } = useColorScheme();

  const mapTheme = usePreferenceStore((state) => state.mapTheme);
  const router = useRouter();
  const draftJourney = useJourneyStore((state) => state.draftJourney);
  const userLocation = useUserLocationStore((state) => state.userLocation);
  const [loaded, setLoaded] = useState(false);
  const currentlyViewedJourney = useJourneyStore((state) => state.currentlyViewedJourney);

  const initialCameraPosition = userLocation
    ? {
        centerCoordinate: [userLocation.lon, userLocation.lat],
        zoomLevel: 13,
      }
    : null;

  const sortedLocations = useMemo(() => {
    return (
      draftJourney?.locations.sort(
        (a: DraftLocation, b: DraftLocation) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      ) || []
    );
  }, [draftJourney]);

  const coordinates = useMemo(() => {
    return (
      sortedLocations?.map((location: DraftLocation) => [
        location.coordinates.longitude,
        location.coordinates.latitude,
      ]) || []
    );
  }, [sortedLocations]);

  const bounds = useMemo(() => getBounds({ coordinates }), [coordinates]);

  useEffect(() => {
    if (sortedLocations.length === 0 && loaded) {
      centerOnLocation({
        location: {
          latitude: userLocation?.lat!,
          longitude: userLocation?.lon!,
        },
        cameraRef,
        animationDuration: 0,
      });
    } else if (sortedLocations.length > 0 && loaded) {
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

  useEffect(() => {
    if (currentlyViewedJourney) {
      cameraRef.current?.flyTo(
        [currentlyViewedJourney.coordinates.longitude, currentlyViewedJourney.coordinates.latitude],
        500
      );
    }
  }, [currentlyViewedJourney]);

  Mapbox.setAccessToken(accessToken);
  return (
    <>
      <View className="absolute right-8 top-16 z-50 items-center gap-4 ">
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
        <JourneyMapButton
          iconName="MapPin"
          onPress={() => {
            if (sortedLocations.length === 0) {
              centerOnLocation({
                location: {
                  latitude: userLocation?.lat!,
                  longitude: userLocation?.lon!,
                },
                cameraRef,
                animationDuration: 800,
              });
            } else if (sortedLocations.length > 0) {
              centerOnCoordinates({
                minLon: bounds.minLon,
                minLat: bounds.minLat,
                maxLon: bounds.maxLon,
                maxLat: bounds.maxLat,
                cameraRef,
                paddingConfig: PADDINGCONFIG,
                animationDuration: 800,
              });
            }
          }}
        />
      </View>
      {!draftJourney && (
        <Pressable
          disabled={draftJourney}
          hitSlop={10}
          className="absolute bottom-8 right-8 z-50 active:scale-95"
          onPress={() => {
            router.push({
              pathname: '/form/[slug]',
              params: { slug: '' },
            });
          }}>
          <View className="flex flex-row items-center justify-center gap-2 rounded-lg border-2 border-black bg-background px-3 py-2 shadow-2xl dark:border-black dark:bg-background-dark">
            <PlaneTakeoff size={19} color={colorScheme === 'dark' ? '#f1f1f1' : '#000'} />
            <Text className="text-lg font-semibold text-text dark:text-text-dark">
              Start Journey
            </Text>
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
        attributionPosition={{ top: 64, left: 100 }}
        scaleBarEnabled={false}
        onDidFinishLoadingMap={() => {
          setLoaded(true);
        }}>
        {initialCameraPosition && loaded && (
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
        {sortedLocations.length > 1 && <LineSegment coordinates={coordinates} />}

        <MainMapMarker locations={sortedLocations} />
      </MapView>
    </>
  );
}

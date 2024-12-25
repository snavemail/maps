import React, { useEffect, useState, useMemo } from 'react';
import Mapbox, { Camera, MapView } from '@rnmapbox/maps';
import { useJourneyStore } from '~/stores/useJourney';
import { View } from 'react-native';
import LineSegment from './LineSegment';
import JourneyMapButton from '~/components/Buttons/JourneyMapButton';
import { centerOnCoordinates, centerOnLocation, getBounds } from '~/utils/MapBox';
import { usePreferenceStore } from '~/stores/usePreferences';
import { PADDINGCONFIG } from '~/constants/mapbox';
import JourneyMapPreviewMarker from './Markers/JourneyMapPreviewMarker';
import { useRouter } from 'expo-router';

export default function MainMap({
  journey,
  cameraRef,
}: {
  journey: JourneyWithProfile;
  cameraRef: React.RefObject<Camera>;
}) {
  const router = useRouter();
  const accessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error('Please provide a Mapbox access token');
  }

  const mapTheme = usePreferenceStore((state) => state.mapTheme);
  const [loaded, setLoaded] = useState(false);
  const currentlyViewedJourney = useJourneyStore((state) => state.currentlyViewedJourney);

  const isSameLocation =
    journey.locations.length === 1 ||
    journey.locations.every(
      (location) =>
        location.coordinates.latitude === journey.locations[0].coordinates.latitude &&
        location.coordinates.longitude === journey.locations[0].coordinates.longitude
    );

  const sortedLocations = useMemo(() => {
    return (
      journey.locations.sort(
        (a: LocationInfo, b: LocationInfo) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      ) || []
    );
  }, [journey]);

  const coordinates = useMemo(() => {
    return (
      sortedLocations?.map((location: LocationInfo) => [
        location.coordinates.longitude,
        location.coordinates.latitude,
      ]) || []
    );
  }, [sortedLocations]);

  const bounds = useMemo(() => getBounds({ coordinates }), [coordinates]);

  useEffect(() => {
    if (isSameLocation && loaded) {
      centerOnLocation({
        location: {
          latitude: sortedLocations[0].coordinates.latitude,
          longitude: sortedLocations[0].coordinates.longitude,
        },
        cameraRef,
        animationDuration: 0,
      });
    } else if (sortedLocations.length > 1 && loaded) {
      centerOnCoordinates({
        minLon: bounds.minLon,
        minLat: bounds.minLat,
        maxLon: bounds.maxLon,
        maxLat: bounds.maxLat,
        cameraRef,
        paddingConfig: PADDINGCONFIG,
      });
    }
  }, [cameraRef, bounds, loaded]);

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
        <JourneyMapButton iconName="X" onPress={() => router.back()} />
        <JourneyMapButton
          iconName="MapPin"
          onPress={() => {
            if (isSameLocation) {
              centerOnLocation({
                location: {
                  latitude: sortedLocations[0].coordinates.latitude,
                  longitude: sortedLocations[0].coordinates.longitude,
                },
                cameraRef,
                animationDuration: 800,
              });
            } else {
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
        {loaded && isSameLocation ? (
          <Camera
            ref={cameraRef}
            zoomLevel={13}
            centerCoordinate={[
              sortedLocations[0].coordinates.longitude,
              sortedLocations[0].coordinates.latitude,
            ]}
            animationMode="none"
            animationDuration={0}
          />
        ) : (
          <Camera
            ref={cameraRef}
            zoomLevel={13}
            bounds={{
              ne: [bounds.maxLon, bounds.maxLat],
              sw: [bounds.minLon, bounds.minLat],
              paddingLeft: 25,
              paddingRight: 25,
              paddingTop: 25,
              paddingBottom: 25,
            }}
            animationMode="none"
            animationDuration={0}
          />
        )}
        {sortedLocations.length > 1 && <LineSegment coordinates={coordinates} />}

        <JourneyMapPreviewMarker locations={sortedLocations} />
      </MapView>
    </>
  );
}

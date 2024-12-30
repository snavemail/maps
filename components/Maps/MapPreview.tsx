import React, { useState, useMemo, useEffect, useRef } from 'react';
import Mapbox, { Camera, MapView, PointAnnotation } from '@rnmapbox/maps';
import LineSegment from '~/components/Maps/LineSegment';
import { centerOnCoordinates, centerOnLocation, getBounds, sameLocation } from '~/utils/MapBox';
import { usePreferenceStore } from '~/stores/usePreferences';
import JourneyMapPreviewMarker from './Markers/JourneyMapPreviewMarker';
import { View } from 'react-native';
import { PADDINGCONFIG } from '~/constants/mapbox';

export default function MapPreview({ journey }: { journey: JourneyWithProfile }) {
  const accessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const cameraRef = useRef<Camera>(null);

  if (!accessToken) {
    throw new Error('Please provide a Mapbox access token');
  }

  const mapTheme = usePreferenceStore((state) => state.mapTheme);
  const [loaded, setLoaded] = useState(false);

  const isSameLocation = sameLocation(journey.locations);

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

  const initialCameraPosition = isSameLocation
    ? {
        centerCoordinate: [
          sortedLocations[0].coordinates.longitude,
          sortedLocations[0].coordinates.latitude,
        ],
        zoomLevel: 13,
      }
    : {
        bounds: {
          ne: [bounds.maxLon, bounds.maxLat],
          sw: [bounds.minLon, bounds.minLat],
          paddingLeft: 25,
          paddingRight: 25,
          paddingTop: 25,
          paddingBottom: 25,
        },
      };

  useEffect(() => {
    if (loaded && cameraRef.current) {
      if (isSameLocation) {
        cameraRef.current?.setCamera({
          centerCoordinate: [
            sortedLocations[0].coordinates.longitude,
            sortedLocations[0].coordinates.latitude,
          ],
          zoomLevel: 13,
          animationDuration: 0,
        });
      } else {
        cameraRef.current?.setCamera({
          bounds: {
            ne: [bounds.maxLon, bounds.maxLat],
            sw: [bounds.minLon, bounds.minLat],
            paddingLeft: 25,
            paddingRight: 25,
            paddingTop: 25,
            paddingBottom: 25,
          },
          animationDuration: 0,
        });
      }
    }
  }, [loaded, isSameLocation, bounds, sortedLocations]);

  Mapbox.setAccessToken(accessToken);
  return (
    <View className="flex-1">
      <MapView
        projection="mercator"
        style={{ flex: 1 }}
        styleURL={mapTheme}
        logoEnabled={true}
        compassEnabled={false}
        zoomEnabled={false}
        pitchEnabled={false}
        rotateEnabled={false}
        scrollEnabled={false}
        attributionEnabled={false}
        logoPosition={{ bottom: 0, left: 0 }}
        attributionPosition={{ bottom: 0, left: 100 }}
        onDidFinishLoadingMap={() => {
          setLoaded(true);
        }}
        scaleBarEnabled={false}>
        <Camera
          animationMode="none"
          animationDuration={0}
          ref={cameraRef}
          {...initialCameraPosition}
        />
        {sortedLocations.length > 1 && <LineSegment coordinates={coordinates} />}

        <JourneyMapPreviewMarker locations={sortedLocations} />
      </MapView>
      <View className="absolute bottom-0 left-0 right-0 top-0 z-50 bg-transparent" />
    </View>
  );
}

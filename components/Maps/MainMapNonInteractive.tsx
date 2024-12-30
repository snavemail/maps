import React, { useState, useMemo, useRef, useEffect } from 'react';
import Mapbox, { Camera, MapView } from '@rnmapbox/maps';
import { useJourneyStore } from '~/stores/useJourney';
import LineSegment from '~/components/Maps/LineSegment';
import { getBounds, sameLocation } from '~/utils/MapBox';
import { usePreferenceStore } from '~/stores/usePreferences';
import MainMapMarker from '~/components/Maps/Markers/MainMapMarker';
import { CameraRef } from '@rnmapbox/maps/lib/typescript/src/components/Camera';
import { View } from 'react-native';

export default function NonInteractiveMap() {
  const accessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const cameraRef = useRef<CameraRef>(null);

  if (!accessToken) {
    throw new Error('Please provide a Mapbox access token');
  }

  const mapTheme = usePreferenceStore((state) => state.mapTheme);
  const draftJourney = useJourneyStore((state) => state.draftJourney);
  const [loaded, setLoaded] = useState(false);

  const isSameLocation = sameLocation(draftJourney?.locations || []);

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

  const initialCameraPosition = isSameLocation
    ? {
        centerCoordinate: [
          sortedLocations[0].coordinates.longitude,
          sortedLocations[0].coordinates.latitude,
        ],
        zoomLevel: 13,
        bounds: undefined,
      }
    : {
        centerCoordinate: undefined,
        zoomLevel: undefined,
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
      console.log('setting camera');
      // setTimeout(() => {
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
      // }, 1); // 100ms delay
    }
  }, [loaded, isSameLocation, bounds, sortedLocations]);

  Mapbox.setAccessToken(accessToken);
  return (
    <View className="h-64">
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
        <MainMapMarker locations={sortedLocations} nonInteractive={true} />
      </MapView>
      <View className="absolute bottom-0 left-0 right-0 top-0 z-50 bg-transparent" />
    </View>
  );
}

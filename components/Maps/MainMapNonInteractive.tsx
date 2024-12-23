import React, { useState, useMemo, useRef, useEffect } from 'react';
import Mapbox, { Camera, MapView } from '@rnmapbox/maps';
import { useJourneyStore } from '~/stores/useJourney';
import LineSegment from '~/components/LineSegment';
import { centerOnCoordinates, getBounds } from '~/utils/MapBox';
import { usePreferenceStore } from '~/stores/usePreferences';
import MainMapMarker from '~/components/MainMapMarker';
import { CameraRef } from '@rnmapbox/maps/lib/typescript/src/components/Camera';
import { View } from 'react-native';

export default function NonInteractiveMap() {
  const accessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error('Please provide a Mapbox access token');
  }

  const mapTheme = usePreferenceStore((state) => state.mapTheme);
  const draftJourney = useJourneyStore((state) => state.draftJourney);
  const [loaded, setLoaded] = useState(false);
  const cameraRef = useRef<CameraRef>(null);

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
        {loaded && (
          <>
            <Camera
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
            {sortedLocations.length > 1 && <LineSegment coordinates={coordinates} />}
            <MainMapMarker locations={sortedLocations} nonInteractive={true} />
          </>
        )}
      </MapView>
    </View>
  );
}

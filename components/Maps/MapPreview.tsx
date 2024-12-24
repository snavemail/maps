import React, { useState, useMemo } from 'react';
import Mapbox, { Camera, MapView } from '@rnmapbox/maps';
import LineSegment from '~/components/Maps/LineSegment';
import { getBounds } from '~/utils/MapBox';
import { usePreferenceStore } from '~/stores/usePreferences';
import JourneyMapPreviewMarker from './Markers/JourneyMapPreviewMarker';

export default function MapPreview({ journey }: { journey: JourneyWithProfile }) {
  const accessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error('Please provide a Mapbox access token');
  }

  const mapTheme = usePreferenceStore((state) => state.mapTheme);
  const [loaded, setLoaded] = useState(false);

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

  Mapbox.setAccessToken(accessToken);
  return (
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
          {isSameLocation ? (
            <Camera
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
        </>
      )}
    </MapView>
  );
}

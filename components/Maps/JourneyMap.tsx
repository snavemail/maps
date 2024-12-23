import { View, Text } from 'react-native';
import React, { RefObject, useState } from 'react';
import Mapbox, { Camera, MapView, PointAnnotation, StyleURL } from '@rnmapbox/maps';
import LineSegment from '../LineSegment';
import JourneyMapButton from '../JourneyMapButton';
import MapMarker from '../Markers/MapMarker';
import { centerOnCoordinates } from '~/utils/MapBox';
import { usePreferenceStore } from '~/stores/usePreferences';
import { PADDINGCONFIG } from '~/constants/mapbox';

export default function JourneyMap({
  journey,
  cameraRef,
}: {
  journey: JourneyWithProfile;
  cameraRef: RefObject<Camera>;
}) {
  const mapTheme = usePreferenceStore((state) => state.mapTheme);
  const accessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error('Please provide a Mapbox access token!');
  }

  const locations = journey.locations.sort(
    (a: LocationInfo, b: LocationInfo) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const coordinates = locations.map((location: LocationInfo) => [
    location.coordinates.longitude,
    location.coordinates.latitude,
  ]);

  const [minLon, minLat, maxLon, maxLat] = coordinates.reduce(
    (bounds: number[], [lon, lat]: any) => [
      Math.min(bounds[0], lon),
      Math.min(bounds[1], lat),
      Math.max(bounds[2], lon),
      Math.max(bounds[3], lat),
    ],
    [Infinity, Infinity, -Infinity, -Infinity]
  );

  Mapbox.setAccessToken(accessToken);
  return (
    <>
      <View className="absolute right-8 top-20 z-50 items-center gap-4">
        <JourneyMapButton
          iconName="MapPin"
          onPress={() =>
            centerOnCoordinates({
              minLon,
              minLat,
              maxLon,
              maxLat,
              cameraRef,
              paddingConfig: PADDINGCONFIG,
            })
          }
        />
        <JourneyMapButton
          iconName="Compass"
          onPress={() => cameraRef.current?.setCamera({ heading: 0, animationDuration: 800 })}
        />
      </View>
      <MapView
        projection="mercator"
        style={{ flex: 1 }}
        styleURL={mapTheme}
        logoEnabled={true}
        attributionEnabled={true}
        zoomEnabled={true}
        scrollEnabled={true}
        rotateEnabled={true}
        pitchEnabled={true}
        scaleBarEnabled={false}
        logoPosition={{ top: 64, left: 8 }}
        attributionPosition={{ top: 64, left: 100 }}>
        <Camera
          ref={cameraRef}
          bounds={{ ne: [maxLon, maxLat], sw: [minLon, minLat] }}
          animationMode="linearTo"
          padding={{
            paddingLeft: PADDINGCONFIG[3],
            paddingRight: PADDINGCONFIG[1],
            paddingTop: PADDINGCONFIG[0],
            paddingBottom: PADDINGCONFIG[2],
          }}
        />
        <LineSegment coordinates={coordinates} />
        {locations.map((location: any) => (
          <MapMarker location={location} key={location.id} />
        ))}
      </MapView>
    </>
  );
}

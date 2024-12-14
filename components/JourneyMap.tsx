import { View, Text } from 'react-native';
import React, { RefObject, useState } from 'react';
import Mapbox, { Camera, MapView, PointAnnotation, StyleURL } from '@rnmapbox/maps';
import LineSegment from './LineSegment';
import JourneyMapButton from './JourneyMapButton';
import MapMarker from './MapMarker';

export default function JourneyMap({
  journey,
  cameraRef,
}: {
  journey: JourneyWithProfile;
  cameraRef: RefObject<Camera>;
}) {
  const PADDINGCONFIG = [88, 50, 350, 50]; //top, right, bottom, left
  const accessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error('Please provide a Mapbox access token!');
  }
  const [currentPitch, setCurrentPitch] = useState(0);

  const locations = journey.locations.sort(
    (a: LocationInfo, b: LocationInfo) => a.position - b.position
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

  const handleCameraChange = (mapState: { properties: { pitch: number } }) => {
    setCurrentPitch(mapState.properties.pitch);
  };

  Mapbox.setAccessToken(accessToken);
  return (
    <>
      <View className="absolute right-8 top-20 z-50 items-center gap-4">
        <JourneyMapButton
          iconName={currentPitch === 0 ? 'angle-up' : 'angle-down'}
          onPress={() => {
            const newPitch = currentPitch === 0 ? 45 : 0;
            cameraRef.current?.setCamera({ pitch: newPitch, animationDuration: 800 });
          }}
        />
        <JourneyMapButton
          iconName="map-marker"
          onPress={() =>
            cameraRef.current?.fitBounds([maxLon, maxLat], [minLon, minLat], PADDINGCONFIG, 800)
          }
        />
        <JourneyMapButton
          iconName="compass"
          onPress={() => cameraRef.current?.setCamera({ heading: 0, animationDuration: 800 })}
        />
        <JourneyMapButton
          iconName="hourglass-start"
          onPress={() =>
            cameraRef.current?.setCamera({
              bounds: { ne: [maxLon, maxLat], sw: [minLon, minLat] },
              padding: {
                paddingLeft: PADDINGCONFIG[3],
                paddingRight: PADDINGCONFIG[1],
                paddingTop: PADDINGCONFIG[0],
                paddingBottom: PADDINGCONFIG[2],
              },
              heading: 0,
              animationDuration: 800,
              pitch: 0,
            })
          }
          iconSize={24}
        />
      </View>
      <MapView
        projection="mercator"
        style={{ flex: 1 }}
        styleURL={StyleURL.Dark}
        logoEnabled={true}
        attributionEnabled={true}
        zoomEnabled={true}
        scrollEnabled={true}
        rotateEnabled={true}
        pitchEnabled={true}
        scaleBarEnabled={false}
        onCameraChanged={handleCameraChange}>
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

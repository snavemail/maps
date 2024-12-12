import { View, Text } from 'react-native';
import React, { useRef } from 'react';
import Mapbox, { Camera, MapView, PointAnnotation, StyleURL, SymbolLayer } from '@rnmapbox/maps';
import LineSegment from './LineSegment';

export default function MapPreview({ journey }: any) {
  const accessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error('Please provide a Mapbox access token!');
  }
  const cameraRef = useRef<Camera>(null);
  const locations = journey.locations.sort((a: any, b: any) => a.position - b.position);
  const coordinates = locations.map((location: any) => [
    location.coordinates.longitude,
    location.coordinates.latitude,
  ]);

  const [minLon, minLat, maxLon, maxLat] = coordinates.reduce(
    (bounds: number[], [lon, lat]: any) => [
      Math.min(bounds[0], lon), // min longitude
      Math.min(bounds[1], lat), // min latitude
      Math.max(bounds[2], lon), // max longitude
      Math.max(bounds[3], lat),
    ],
    [Infinity, Infinity, -Infinity, -Infinity]
  );

  // useEffect(() => {
  //   cameraRef.current?.fitBounds([maxLon, maxLat], [minLon, minLat], [50, 50]);
  // }, []);

  Mapbox.setAccessToken(accessToken);
  return (
    <MapView
      style={{ flex: 1 }}
      styleURL={StyleURL.Dark}
      logoEnabled={false}
      attributionEnabled={false}
      zoomEnabled={false}
      scrollEnabled={false}
      rotateEnabled={false}
      pitchEnabled={false}
      scaleBarEnabled={false}>
      <Camera
        ref={cameraRef}
        bounds={{ ne: [maxLon, maxLat], sw: [minLon, minLat] }}
        animationMode="easeTo"
        padding={{ paddingLeft: 50, paddingRight: 50, paddingTop: 50, paddingBottom: 50 }}
      />
      <LineSegment coordinates={coordinates} />
      {locations.map((location: any) => (
        <PointAnnotation
          key={location.id}
          id={location.id}
          coordinate={[location.coordinates.longitude, location.coordinates.latitude]}>
          <View className="rounded-full bg-blue-500 p-1">
            <Text className="text-sm font-extrabold text-white">{location.position}</Text>
          </View>
        </PointAnnotation>
      ))}
    </MapView>
  );
}

import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { PointAnnotation } from '@rnmapbox/maps';

export default function MapMarker({ location }: any) {
  return (
    <PointAnnotation
      key={location.id}
      id={location.id}
      coordinate={[location.coordinates.longitude, location.coordinates.latitude]}>
      <FontAwesome name="map-pin" size={12} color="white" />
    </PointAnnotation>
  );
}

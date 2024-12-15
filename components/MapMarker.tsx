import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { PointAnnotation } from '@rnmapbox/maps';

type MapMarkerLocation = Pick<DraftLocation | LocationInfo, 'id' | 'coordinates'>;

interface MapMarkerProps {
  location: MapMarkerLocation;
}

export default function MapMarker({ location }: MapMarkerProps) {
  return (
    <PointAnnotation
      key={location.id}
      id={location.id}
      coordinate={[location.coordinates.longitude, location.coordinates.latitude]}>
      <FontAwesome name="map-pin" size={12} color="white" />
    </PointAnnotation>
  );
}

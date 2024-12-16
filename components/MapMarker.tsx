import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { PointAnnotation } from '@rnmapbox/maps';

type MapMarkerLocation = Pick<DraftLocation | LocationInfo, 'id' | 'coordinates'>;

interface MapMarkerProps {
  location: MapMarkerLocation;
  hidden?: boolean;
}

export default function MapMarker({ location, hidden }: MapMarkerProps) {
  return (
    <PointAnnotation
      key={location.id}
      id={location.id}
      coordinate={[location.coordinates.longitude, location.coordinates.latitude]}>
      {hidden ? (
        <FontAwesome name="eye-slash" size={18} color="white" />
      ) : (
        <FontAwesome name="map-pin" size={12} color="white" />
      )}
    </PointAnnotation>
  );
}

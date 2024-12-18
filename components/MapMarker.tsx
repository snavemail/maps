import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { PointAnnotation } from '@rnmapbox/maps';
import { StyleURL, usePreferenceStore } from '~/stores/usePreferences';

type MapMarkerLocation = Pick<DraftLocation | LocationInfo, 'id' | 'coordinates'>;

interface MapMarkerProps {
  location: MapMarkerLocation;
  hidden?: boolean;
}

export default function MapMarker({ location, hidden }: MapMarkerProps) {
  const mapTheme = usePreferenceStore((state) => state.mapTheme);
  const pinColor = mapTheme === StyleURL.Dark ? 'white' : 'black';

  return (
    <PointAnnotation
      key={location.id}
      id={location.id}
      coordinate={[location.coordinates.longitude, location.coordinates.latitude]}>
      {hidden ? (
        <FontAwesome name="eye-slash" size={18} color={pinColor} />
      ) : (
        <FontAwesome name="map-pin" size={12} color={pinColor} />
      )}
    </PointAnnotation>
  );
}

import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { PointAnnotation } from '@rnmapbox/maps';
import { StyleURL, usePreferenceStore } from '~/stores/usePreferences';
import { useJourneyStore } from '~/stores/useJourney';

type MapMarkerLocation = Pick<DraftLocation | LocationInfo, 'id' | 'coordinates'>;

interface MapMarkerProps {
  location: MapMarkerLocation;
  hidden?: boolean;
}

export default function MapMarker({ location, hidden }: MapMarkerProps) {
  const mapTheme = usePreferenceStore((state) => state.mapTheme);
  const pinColor = mapTheme === StyleURL.Dark ? 'white' : 'black';
  const currentlyViewedJourney = useJourneyStore((state) => state.currentlyViewedJourney);

  return (
    <PointAnnotation
      key={location.id}
      id={location.id}
      coordinate={[location.coordinates.longitude, location.coordinates.latitude]}>
      {hidden ? (
        <FontAwesome name="eye-slash" size={18} color={pinColor} />
      ) : (
        <FontAwesome
          name="map-pin"
          size={currentlyViewedJourney?.id === location.id ? 12 : 18}
          color={pinColor}
        />
      )}
    </PointAnnotation>
  );
}

import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { PointAnnotation, ShapeSource, SymbolLayer } from '@rnmapbox/maps';
import { StyleURL, usePreferenceStore } from '~/stores/usePreferences';
import { useJourneyStore } from '~/stores/useJourney';

type MapMarkerLocation = Pick<DraftLocation | LocationInfo, 'id' | 'coordinates'>;

interface MapMarkerProps {
  location: MapMarkerLocation;
  hidden?: boolean;
}

export default function MapMarker({ location, hidden }: MapMarkerProps) {
  const mapTheme = usePreferenceStore((state) => state.mapTheme);
  const currentlyViewedJourney = useJourneyStore((state) => state.currentlyViewedJourney);

  return (
    <ShapeSource
      id={`marker-${location.id}`}
      shape={{
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [location.coordinates.longitude, location.coordinates.latitude],
        },
        properties: {
          id: location.id,
          isHidden: hidden,
          isSelected: currentlyViewedJourney?.id === location.id,
        },
      }}>
      <SymbolLayer
        id={`marker-layer-${location.id}`}
        style={{
          iconImage: mapTheme === StyleURL.Dark ? 'map-pin-dark' : 'map-pin-light',
          iconSize: ['case', ['get', 'isSelected'], 1.2, 1],
          iconAllowOverlap: true,
          iconIgnorePlacement: true,
        }}
      />
    </ShapeSource>
  );
}

import React from 'react';
import { ShapeSource, SymbolLayer, Images, Camera } from '@rnmapbox/maps';
import { Feature, Point, Position } from 'geojson';
import { StyleURL, usePreferenceStore } from '~/stores/usePreferences';
import { useJourneyStore } from '~/stores/useJourney';

interface MainMapMarkerProps {
  locations: LocationInfo[];
}
export default function JourneyMapPreviewMarker({ locations }: MainMapMarkerProps) {
  const { mapTheme } = usePreferenceStore();

  const featureCollection: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: locations.map(
      (location): Feature<Point> => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [location.coordinates.longitude, location.coordinates.latitude] as Position,
        },
        properties: {
          id: location.id,
          location: location,
        },
      })
    ),
  };
  return (
    <>
      <ShapeSource id="markerSource" clusterMaxZoomLevel={14} shape={featureCollection}>
        <SymbolLayer
          id="markerLayer"
          style={{
            iconImage: 'marker-filled',
            iconSize: 1.3,
            iconColor: 'black',
            iconOpacity: 1,
            iconAllowOverlap: true,
            iconIgnorePlacement: true,
            textAllowOverlap: true,
            textIgnorePlacement: true,
            iconOffset: [0, 0],
          }}
        />
      </ShapeSource>
    </>
  );
}

import React from 'react';
import { ShapeSource, SymbolLayer } from '@rnmapbox/maps';
import { Feature, Point, Position } from 'geojson';

import { useColorScheme } from 'nativewind';

interface MainMapMarkerProps {
  locations: LocationInfo[];
}
export default function JourneyMapPreviewMarker({ locations }: MainMapMarkerProps) {
  const { colorScheme } = useColorScheme();

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
            iconImage: colorScheme === 'light' ? 'map-pin-dark' : 'map-pin-light',
            iconSize: 1.3,
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

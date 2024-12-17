import React, { useEffect, useState } from 'react';
import { ShapeSource, SymbolLayer, Images } from '@rnmapbox/maps';
import { Feature, Point, Position } from 'geojson';
import { useSearchStore } from '~/stores/useSearch';
type ResultMapMarker = {
  id: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  maki: string;
  name: string;
};
interface MapMarkerProps {
  locations: LocationResult[];
  onMarkerPress?: (locationId: string) => void;
}
export default function SearchMapMarker({ locations, onMarkerPress }: MapMarkerProps) {
  const { selectedResult, setSelectedResult } = useSearchStore();

  const featureCollection: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: locations.map(
      (location): Feature<Point> => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [
            location.properties.coordinates.longitude,
            location.properties.coordinates.latitude,
          ] as Position,
        },
        properties: {
          id: location.properties.mapbox_id,
          icon: location.properties.maki || 'lodging',
          selected: location.properties.mapbox_id !== selectedResult?.properties.mapbox_id,
          location: location,
        },
      })
    ),
  };
  return (
    <>
      <ShapeSource
        id="markerSource"
        shape={featureCollection}
        onPress={(e) => {
          const feature = e.features[0];
          console.log('Feature pressed:', feature);
          if (feature?.properties?.id) {
            setSelectedResult(feature.properties.location);
            if (onMarkerPress) {
              onMarkerPress(feature.properties.location);
            }
          }
        }}>
        <SymbolLayer
          id="markerLayer"
          style={{
            iconImage: ['get', 'icon'], // This will match with the 'icon' property in our features
            iconSize: ['case', ['boolean', ['get', 'selected'], false], 1.5, 1.3],
            iconColor: 'blue',
            iconOpacity: 1,
            iconAllowOverlap: true,
            iconIgnorePlacement: true,
          }}
        />
      </ShapeSource>
    </>
  );
}

import React, { RefObject } from 'react';
import { ShapeSource, SymbolLayer, CircleLayer } from '@rnmapbox/maps';
import { Feature, Point, Position } from 'geojson';
import { useSearchStore } from '~/stores/useSearch';
import { Camera } from '@rnmapbox/maps';
import { StyleURL, usePreferenceStore } from '~/stores/usePreferences';

interface MapMarkerProps {
  locations: LocationResult[];
  onMarkerPress?: (locationId: string) => void;
  cameraRef: RefObject<Camera>;
}
export default function SearchMapMarker({ locations, onMarkerPress, cameraRef }: MapMarkerProps) {
  const { selectedResult, setSelectedResult } = useSearchStore();
  const { mapTheme } = usePreferenceStore();
  const isDarkTheme = mapTheme === StyleURL.Dark;
  const textColor = isDarkTheme ? '#fff' : '#000';

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
          name: location.properties.name,
          icon: location.properties.maki || 'marker',
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
        cluster={true}
        clusterRadius={30}
        clusterMaxZoomLevel={14}
        shape={featureCollection}
        onPress={(e) => {
          const feature = e.features[0];
          if (feature?.properties?.id) {
            setSelectedResult(feature.properties.location);
          }
        }}>
        <SymbolLayer
          id="clusters-count"
          style={{
            textField: ['get', 'point_count'],
            textSize: 12,
            textColor: textColor,
            textPitchAlignment: 'map',
            textIgnorePlacement: true,
            textAllowOverlap: true,
          }}
        />

        <CircleLayer
          id="clusters"
          belowLayerID="clusters-count"
          filter={['has', 'point_count']}
          style={{
            circlePitchAlignment: 'viewport',
            circleColor: '#1f1f1f', // Modern dark gray color
            circleRadius: 14, // Slightly smaller radius for balance
            circleOpacity: 1,
            circleStrokeWidth: 2,
            circleStrokeColor: textColor, // Off-white for a modern stroke
          }}
        />
        <SymbolLayer
          id="markerLayer"
          filter={['!', ['has', 'point_count']]}
          style={{
            iconImage: ['get', 'icon'],
            iconSize: ['case', ['boolean', ['get', 'selected'], false], 1.3, 1.6],
            iconColor: 'red',
            iconOpacity: 1,
            iconAllowOverlap: false, // Allows icons to overlap if necessary
            iconIgnorePlacement: false, // Respects placement rules for icons
            textAllowOverlap: false, // Prevents text from overlapping other text
            textIgnorePlacement: false, // Respects placement rules for text
            textField: ['get', 'name'],
            iconAnchor: 'bottom',
            textSize: 10,
            textColor: textColor,
            textAnchor: 'top',
          }}
        />
      </ShapeSource>
    </>
  );
}

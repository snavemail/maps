import React, { RefObject } from 'react';
import { ShapeSource, SymbolLayer, CircleLayer } from '@rnmapbox/maps';
import { Feature, Point, Position } from 'geojson';
import { useSearchStore } from '~/stores/useSearch';
import { Camera } from '@rnmapbox/maps';
import { StyleURL, usePreferenceStore } from '~/stores/usePreferences';
import { useColorScheme } from 'nativewind';

interface MapMarkerProps {
  locations: LocationResult[];
  onMarkerPress?: (locationId: string) => void;
  cameraRef: RefObject<Camera>;
}
export default function SearchMapMarker({ locations, onMarkerPress, cameraRef }: MapMarkerProps) {
  const { selectedResult, setSelectedResult } = useSearchStore();
  const { mapTheme } = usePreferenceStore();
  const { colorScheme } = useColorScheme();
  const isDarkTheme = mapTheme === StyleURL.Dark;
  const textColor = isDarkTheme ? '#fff' : '#000';
  const circleColor = colorScheme === 'dark' ? '#3f3f3f' : '#f2f2f2';

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
            circleColor: circleColor,
            circleRadius: 14,
            circleOpacity: 1,
            circleStrokeWidth: 2,
            circleStrokeColor: textColor,
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
            iconAllowOverlap: false,
            iconIgnorePlacement: false,
            textAllowOverlap: false,
            textIgnorePlacement: false,
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

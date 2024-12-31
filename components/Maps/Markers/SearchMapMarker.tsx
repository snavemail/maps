import React, { RefObject } from 'react';
import { ShapeSource, SymbolLayer, CircleLayer } from '@rnmapbox/maps';
import { Feature, Point, Position } from 'geojson';
import { useCategoryStore } from '~/stores/useSearch';
import { Camera } from '@rnmapbox/maps';
import { StyleURL, usePreferenceStore } from '~/stores/usePreferences';

interface MapMarkerProps {
  locations: LocationResult[];
  onMarkerPress?: (locationId: string) => void;
  cameraRef: RefObject<Camera>;
}
export default function SearchMapMarker({ locations, onMarkerPress, cameraRef }: MapMarkerProps) {
  const { selectedResult, setSelectedResult } = useCategoryStore();
  const { mapTheme } = usePreferenceStore();
  const isDarkTheme = mapTheme === StyleURL.Dark;
  const textColor = isDarkTheme ? '#fff' : '#000';
  const circleColor = isDarkTheme ? '#3f3f3f' : '#f2f2f2';

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
          icon:
            location.properties.poi_category[0] === 'outdoors'
              ? 'park'
              : location.properties.poi_category[0] === 'shopping'
                ? 'shop'
                : location.properties.maki || 'marker',
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
        clusterRadius={50}
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
            iconAllowOverlap: true,
            iconIgnorePlacement: true,
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
            iconOpacity: 1,
            iconAllowOverlap: true,
            iconIgnorePlacement: true,
            textAllowOverlap: true,
            textIgnorePlacement: true,
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

import React from 'react';
import { ShapeSource, SymbolLayer, Images, Camera } from '@rnmapbox/maps';
import { Feature, Point, Position } from 'geojson';
import { StyleURL, usePreferenceStore } from '~/stores/usePreferences';
import { useJourneyStore } from '~/stores/useJourney';

interface MainMapMarkerProps {
  locations: DraftLocation[];
}
export default function MainMapMarker({ locations }: MainMapMarkerProps) {
  const currentlyViewedJourney = useJourneyStore((state) => state.currentlyViewedJourney);
  const setCurrentViewedLocation = useJourneyStore((state) => state.setCurrentViewedLocation);
  const { mapTheme } = usePreferenceStore();
  const isDarkTheme = mapTheme === StyleURL.Dark;

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
          selected: location.id !== currentlyViewedJourney?.id,
          location: location,
        },
      })
    ),
  };
  return (
    <>
      <ShapeSource
        id="markerSource"
        clusterMaxZoomLevel={14}
        shape={featureCollection}
        onPress={(e) => {
          const feature = e.features[0];
          if (feature?.properties?.id) {
            setCurrentViewedLocation(feature.properties.location);
          }
        }}>
        <SymbolLayer
          id="markerLayer"
          style={{
            iconImage: 'border-dot-13',
            iconSize: ['case', ['boolean', ['get', 'selected'], false], 1.3, 2],
            iconColor: 'red',
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

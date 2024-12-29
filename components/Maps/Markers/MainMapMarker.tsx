import React from 'react';
import { ShapeSource, SymbolLayer } from '@rnmapbox/maps';
import { Feature, Point, Position } from 'geojson';
import { useJourneyStore } from '~/stores/useJourney';
import { useColorScheme } from 'nativewind';

interface MainMapMarkerProps {
  locations: DraftLocation[];
  nonInteractive?: boolean;
}
export default function MainMapMarker({ locations, nonInteractive }: MainMapMarkerProps) {
  const currentlyViewedJourney = useJourneyStore((state) => state.currentlyViewedJourney);
  const setCurrentViewedLocation = useJourneyStore((state) => state.setCurrentViewedLocation);
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
          if (nonInteractive) return;
          const feature = e.features[0];
          if (feature?.properties?.id) {
            setCurrentViewedLocation(feature.properties.location);
          }
        }}>
        <SymbolLayer
          id="markerLayer"
          style={{
            iconImage: colorScheme === 'dark' ? 'map-pin-light' : 'map-pin-dark',
            iconSize: nonInteractive
              ? 1.3
              : ['case', ['boolean', ['get', 'selected'], false], 1.3, 2],
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

import React from 'react';
import { LineLayer, ShapeSource } from '@rnmapbox/maps';
import { Position } from '@rnmapbox/maps/lib/typescript/src/types/Position';
import { StyleURL, usePreferenceStore } from '~/stores/usePreferences';

export default function LineSegment({ coordinates }: { coordinates: Position[] }) {
  const { mapTheme } = usePreferenceStore();
  const isDarkTheme = mapTheme === StyleURL.Dark;
  const lineColor = isDarkTheme ? '#fff' : '#000';
  return (
    <ShapeSource
      id="lineSource"
      shape={{
        properties: {},
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates,
        },
      }}>
      <LineLayer
        id="lineLayer"
        style={{
          lineColor: lineColor,
          lineWidth: 2,
          lineOpacity: 0.5,
        }}
      />
    </ShapeSource>
  );
}

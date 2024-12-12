import React from 'react';
import { LineLayer, ShapeSource } from '@rnmapbox/maps';
import { Position } from '@rnmapbox/maps/lib/typescript/src/types/Position';

export default function LineSegment({ coordinates }: { coordinates: Position[] }) {
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
          lineColor: '#00ff00',
          lineWidth: 2,
          lineOpacity: 0.3,
        }}
      />
    </ShapeSource>
  );
}

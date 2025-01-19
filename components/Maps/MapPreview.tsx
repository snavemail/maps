import React, { useRef } from 'react';
import { Camera } from '@rnmapbox/maps';
import JourneyMapPreviewMarker from './Markers/JourneyMapPreviewMarker';
import BaseMap from './BaseMap';

export default function MapPreview({ journey }: { journey: JourneyWithProfile }) {
  const cameraRef = useRef<Camera>(null);

  return (
    <BaseMap
      locations={journey.locations}
      interactive={false}
      cameraRef={cameraRef}
      animationDuration={0}
      projection="mercator">
      <JourneyMapPreviewMarker locations={journey.locations} />
    </BaseMap>
  );
}

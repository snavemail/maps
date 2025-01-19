import React from 'react';
import { Camera } from '@rnmapbox/maps';
import JourneyMapPreviewMarker from './Markers/JourneyMapPreviewMarker';
import { useRouter } from 'expo-router';
import InteractiveMap from './InteractiveMap';

export default function JourneyMap({
  journey,
  cameraRef,
}: {
  journey: JourneyWithProfile;
  cameraRef: React.RefObject<Camera>;
}) {
  const router = useRouter();

  return (
    <InteractiveMap
      locations={journey.locations}
      cameraRef={cameraRef}
      onBackPress={() => router.back()}
      showLocationPuck={false}
      showLocationButton={false}>
      <JourneyMapPreviewMarker locations={journey.locations} />
    </InteractiveMap>
  );
}

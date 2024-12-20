import MainMap from '~/components/MainMap';
import React from 'react';
import DraftJourneyTimeline from '~/components/AddLocation/DraftJourneyTimeline';
import { useJourneyStore } from '~/stores/useJourney';
import { Camera } from '@rnmapbox/maps';

export default function Map() {
  const draftJourney = useJourneyStore((state) => state.draftJourney);
  const cameraRef = React.useRef<Camera>(null);
  return (
    <>
      <MainMap cameraRef={cameraRef} />
      {draftJourney && <DraftJourneyTimeline cameraRef={cameraRef} />}
    </>
  );
}

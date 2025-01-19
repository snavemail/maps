import React from 'react';
import { useJourneyStore } from '~/stores/useJourney';
import MainMapMarker from '~/components/Maps/Markers/MainMapMarker';
import BaseMap from './BaseMap';

export default function MainMapNonInteractive() {
  const draftJourney = useJourneyStore((state) => state.draftJourney);

  return (
    <BaseMap locations={draftJourney?.locations || []} interactive={false} className="h-64">
      <MainMapMarker locations={draftJourney?.locations || []} nonInteractive={true} />
    </BaseMap>
  );
}

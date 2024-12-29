import React, { useContext } from 'react';
import JourneyPage from '~/components/Journey/JourneyPage';
import { JourneyContext } from './_layout';

export default function JourneyScreen() {
  const { journey } = useContext(JourneyContext);
  if (!journey) return null;
  return <JourneyPage journey={journey} />;
}

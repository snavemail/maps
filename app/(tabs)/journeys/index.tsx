import { View, Text, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { journeyService } from '~/services/journeyService';
import { useAuthStore } from '~/stores/useAuth';
import JourneyPreview from '~/components/JourneyPreview';

export default function Journeys() {
  const [journeys, setJourneys] = useState<JourneyWithProfile[]>([]);
  const profile = useAuthStore((state) => state.profile);
  const [loading, setLoading] = useState(true);
  if (!profile) {
    return null;
  }

  useEffect(() => {
    fetchMyJourneys();
  }, []);

  const fetchMyJourneys = async (): Promise<void> => {
    const myJourneys = await journeyService.fetchMyJourneys();
    setJourneys(myJourneys);
  };

  return (
    <FlatList
      data={journeys}
      renderItem={({ item }: { item: JourneyWithProfile }) => <JourneyPreview journey={item} />}
      keyExtractor={(item: JourneyWithProfile) => item.id}
    />
  );
}

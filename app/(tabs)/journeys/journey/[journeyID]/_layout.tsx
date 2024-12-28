import { Stack } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { createContext, useEffect, useState } from 'react';
import { journeyService } from '~/services/journeyService';
import { useImageStore } from '~/stores/useImage';
import { useJourneyCache } from '~/stores/useJourneyCache';

export default function JourneyLayout() {
  const { journeyID } = useLocalSearchParams();
  const cachedJourney = useJourneyCache().getJourney(journeyID as string);
  const [journey, setJourney] = useState<JourneyWithProfile | null>(null);
  const { colorScheme } = useColorScheme();

  const preloadImages = async (locations: LocationInfo[]) => {
    const imagePaths = locations.flatMap((loc) => loc.images || []);
    const getSignedUrl = useImageStore.getState().getSignedUrl;
    await Promise.all(imagePaths?.map((path) => getSignedUrl(path)));
  };

  useEffect(() => {
    if (cachedJourney) {
      setJourney(cachedJourney);
    }
  }, [cachedJourney]);

  useEffect(() => {
    if (!cachedJourney) {
      fetchJourney();
    }
  }, [journeyID]);

  useEffect(() => {
    if (journey?.locations) {
      preloadImages(journey.locations);
    }
  }, [journey]);

  const fetchJourney = async () => {
    const journeyWithProfile = await journeyService.fetchJourney(journeyID as string);
    setJourney(journeyWithProfile);
  };

  return (
    <JourneyContext.Provider value={{ journey, setJourney }}>
      <Stack
        screenOptions={{
          contentStyle: {
            backgroundColor: 'transparent',
          },
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#1f1f1f' : '#fff',
          },
          headerTitleStyle: {
            color: colorScheme === 'dark' ? '#f1f1f1' : '#000',
          },
          headerTintColor: colorScheme === 'dark' ? '#f1f1f1' : '#000',
        }}>
        <Stack.Screen name="index" options={{ headerShown: true, title: 'Journey' }} />
        <Stack.Screen name="map" options={{ headerShown: false }} />
      </Stack>
    </JourneyContext.Provider>
  );
}

export const JourneyContext = createContext<{
  journey: JourneyWithProfile | null;
  setJourney: (journey: JourneyWithProfile | null) => void;
}>({
  journey: null,
  setJourney: () => {},
});

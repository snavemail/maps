import { Stack, useLocalSearchParams } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { createContext, Suspense, useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useJourney } from '~/hooks/useJourney';
import { useImageStore } from '~/stores/useImage';

interface JourneyContextType {
  journey: JourneyWithProfile | null;
  isLoading: boolean;
}

export const JourneyContext = createContext<JourneyContextType>({
  journey: null,
  isLoading: false,
});

export default function JourneyLayout() {
  const { journeyID } = useLocalSearchParams();

  return (
    <Suspense
      fallback={
        <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark">
          <ActivityIndicator size="large" className="color-primary" />
        </View>
      }>
      <JourneyLayoutContent journeyID={journeyID as string} />
    </Suspense>
  );
}

function JourneyLayoutContent({ journeyID }: { journeyID: string }) {
  const { colorScheme } = useColorScheme();

  const preloadImages = async (locations: LocationInfo[]) => {
    const imagePaths = locations.flatMap((loc) => loc.images || []);
    const getSignedUrl = useImageStore.getState().getSignedUrl;
    await Promise.all(imagePaths?.map((path) => getSignedUrl(path)));
  };

  const { journey, isLoading, error } = useJourney(journeyID);

  useEffect(() => {
    preloadImages(journey?.locations || []);
  }, [journey]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark">
        <ActivityIndicator size="large" color="#0f58a0" />
      </View>
    );
  }

  if (error || !journey) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark">
        <Text className="text-text-secondary dark:text-text-dark-secondary">
          Could not load journey
        </Text>
      </View>
    );
  }

  return (
    <JourneyContext.Provider value={{ journey, isLoading }}>
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

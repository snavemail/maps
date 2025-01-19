import React, { useEffect } from 'react';
import { Camera } from '@rnmapbox/maps';
import { useJourneyStore } from '~/stores/useJourney';
import { View, Pressable, Text } from 'react-native';
import { Zap } from 'lucide-react-native';
import { useUserLocationStore } from '~/stores/useUserLocation';
import { useRouter } from 'expo-router';
import MainMapMarker from './Markers/MainMapMarker';
import { useColorScheme } from 'nativewind';
import InteractiveMap from './InteractiveMap';

export default function MainMap({ cameraRef }: { cameraRef: React.RefObject<Camera> }) {
  const { colorScheme } = useColorScheme();
  const router = useRouter();
  const draftJourney = useJourneyStore((state) => state.draftJourney);
  const userLocation = useUserLocationStore((state) => state.userLocation);
  const currentlyViewedJourney = useJourneyStore((state) => state.currentlyViewedJourney);

  useEffect(() => {
    if (currentlyViewedJourney) {
      cameraRef.current?.flyTo(
        [currentlyViewedJourney.coordinates.longitude, currentlyViewedJourney.coordinates.latitude],
        500
      );
    }
  }, [currentlyViewedJourney]);

  return (
    <>
      <InteractiveMap
        locations={draftJourney?.locations || []}
        userLocation={userLocation ?? undefined}
        cameraRef={cameraRef}>
        <MainMapMarker locations={draftJourney?.locations || []} />
      </InteractiveMap>

      {!draftJourney && (
        <Pressable
          disabled={draftJourney}
          hitSlop={10}
          className="absolute bottom-8 right-8 z-50 active:scale-95"
          onPress={() => {
            router.push({
              pathname: '/form/[slug]',
              params: { slug: '' },
            });
          }}>
          <View className="flex flex-row items-center justify-center gap-2 rounded-lg border-2 border-black bg-background px-3 py-2 shadow-2xl dark:border-white dark:bg-background-dark">
            <Zap size={19} color={colorScheme === 'dark' ? '#f1f1f1' : '#000'} />
            <Text className="text-lg font-semibold text-text dark:text-text-dark">
              Start Journey
            </Text>
          </View>
        </Pressable>
      )}
    </>
  );
}

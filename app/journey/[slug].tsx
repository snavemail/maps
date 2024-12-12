import { View, Pressable } from 'react-native';
import React, { useRef } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import JourneyMap from '~/components/JourneyMap';
import { journeys } from '~/data/journeys';
import JourneyMapBottomSheet from '~/components/JourneyMapBottomSheet';
import { Camera } from '@rnmapbox/maps';

export default function Journey() {
  const router = useRouter();
  const { slug } = useLocalSearchParams();
  const journey = journeys.find((journey: any) => journey.journeyID === Number(slug));
  const cameraRef = useRef<Camera>(null);
  return (
    <>
      <View className={`z-0 flex min-h-full flex-1`}>
        <JourneyMap journey={journey} cameraRef={cameraRef} />
      </View>
      <JourneyMapBottomSheet journey={journey} cameraRef={cameraRef} />
      <Pressable onPress={() => router.dismiss()} className="absolute left-8 top-20 z-50">
        <FontAwesome name="close" size={30} color="white" />
      </Pressable>
    </>
  );
}

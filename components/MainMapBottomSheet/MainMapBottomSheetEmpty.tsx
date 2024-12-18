import { View, Text, Pressable, Alert } from 'react-native';
import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { useJourneyStore } from '~/stores/useJourney';
import { useRouter } from 'expo-router';

export default function MainMapBottomSheetEmpty() {
  const endJourney = useJourneyStore((state) => state.endJourney);
  const router = useRouter();

  return (
    <View className="flex h-full items-center justify-center gap-2 bg-white">
      <Pressable
        hitSlop={0}
        onPress={() => {
          router.push({
            pathname: '/addLocation/[slug]',
            params: { slug: '' },
          });
        }}
        className="flex flex-row items-center justify-center gap-2 rounded-lg bg-black px-3 py-2 active:scale-95">
        <FontAwesome name="plus-circle" size={19} color="white" />
        <Text className="text-lg font-semibold text-white">Add Location</Text>
      </Pressable>
      <Pressable onPress={endJourney} className="rounded-full  p-2" hitSlop={8}>
        <View className="flex w-full flex-row gap-2 bg-white p-4">
          <Text className="font-semibold text-red-500">Discard Journey</Text>
        </View>
      </Pressable>
    </View>
  );
}

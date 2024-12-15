import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { BOTTOM_SHEET_HEADER_HEIGHT } from '~/constants/layout';
import { useJourneyStore } from '~/stores/useJourney';

export default function MainMapBottomSheetFooter() {
  const endJourney = useJourneyStore((state) => state.endJourney);
  const publishJourney = useJourneyStore((state) => state.publishJourney);

  return (
    <View className="w-full flex-row items-center justify-center bg-white px-4">
      <Pressable onPress={endJourney} className="rounded-full  p-2" hitSlop={8}>
        <View className="flex w-full flex-row gap-2 bg-white px-4">
          <Text className="underline">End Journey</Text>
        </View>
      </Pressable>
      <Pressable onPress={endJourney} className="rounded-full p-2" hitSlop={8}>
        <View className="flex w-full flex-row gap-2 bg-white px-4">
          <Text className="underline">Publish Journey</Text>
        </View>
      </Pressable>
    </View>
  );
}

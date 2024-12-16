import { View, Text, Pressable, Alert } from 'react-native';
import React from 'react';
import { useJourneyStore } from '~/stores/useJourney';

export default function MainMapBottomSheetFooter({ empty }: { empty: boolean }) {
  const endJourney = useJourneyStore((state) => state.endJourney);
  const publishJourney = useJourneyStore((state) => state.publishJourney);
  const handleDiscard = () => {
    empty
      ? endJourney()
      : Alert.alert('Discard Journey', 'Are you sure you want to discard this journey?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Discard', onPress: endJourney, style: 'destructive' },
        ]);
  };

  return (
    <View className="w-full flex-col items-center justify-center gap-2 bg-white px-4">
      {!empty && (
        <Pressable
          onPress={endJourney}
          className="w-full items-center justify-center rounded-full p-2"
          hitSlop={8}>
          <View className="flex w-full flex-row items-center justify-center gap-2 rounded-full border-2 border-black bg-white p-4">
            <Text className="font-semibold">Publish Journey</Text>
          </View>
        </Pressable>
      )}
      <Pressable onPress={handleDiscard} className="rounded-full  p-2" hitSlop={8}>
        <View className="flex w-full flex-row gap-2 bg-white px-4 pb-4">
          <Text className="font-semibold text-red-500">Discard Journey</Text>
        </View>
      </Pressable>
    </View>
  );
}

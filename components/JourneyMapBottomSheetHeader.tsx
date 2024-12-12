import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { FontAwesome } from '@expo/vector-icons';

export default function JourneyMapBottomSheetHeader({ onAdd }: { onAdd: () => void }) {
  return (
    <View className="flex w-full flex-col bg-white pb-4">
      <View className="flex w-full flex-1 items-center justify-center px-16 py-2">
        <Pressable
          onPress={onAdd}
          className="flex w-full flex-1 items-center justify-center rounded-lg bg-green-800 p-1">
          <View className="flex flex-row items-center justify-center gap-2">
            <FontAwesome name="plus-circle" size={15} color={'white'} />
            <Text className="text-md font-bold text-white">Add to Journey</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

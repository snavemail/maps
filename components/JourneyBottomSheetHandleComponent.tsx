import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react-native';

export default function HandleComponent({
  onPress,
  isExpanded,
}: {
  onPress: () => void;
  isExpanded: boolean;
}) {
  return (
    <View className="flex h-12 w-full flex-col bg-white p-2">
      <Pressable
        onPress={onPress}
        className="flex w-full flex-1 items-center justify-center rounded-lg bg-gray-100 p-1">
        <View className="flex flex-row items-center justify-center gap-2">
          {isExpanded ? (
            <>
              <ChevronDown size={20} color={'black'} />
              <Text className="text-md font-bold text-black">Collapse</Text>
            </>
          ) : (
            <>
              <ChevronUp size={20} color={'black'} />
              <Text className="text-md font-bold text-black">Expand</Text>
            </>
          )}
        </View>
      </Pressable>
    </View>
  );
}

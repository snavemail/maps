import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

export default function HandleComponent({
  onPress,
  isExpanded,
}: {
  onPress: () => void;
  isExpanded: boolean;
}) {
  const { colorScheme } = useColorScheme();
  return (
    <View
      className="flex h-12 w-full flex-col  p-2"
      style={{ backgroundColor: colorScheme === 'dark' ? '#1f1f1f' : '#fff' }}>
      <Pressable
        onPress={onPress}
        className="flex w-full flex-1 items-center justify-center rounded-lg bg-gray-200 p-1 dark:bg-gray-700">
        <View className="flex flex-row items-center justify-center gap-2">
          {isExpanded ? (
            <>
              <ChevronDown size={20} color={colorScheme === 'dark' ? '#f1f1f1' : '#000'} />
              <Text className="text-md font-bold text-text dark:text-text-dark">Collapse</Text>
            </>
          ) : (
            <>
              <ChevronUp size={20} color={colorScheme === 'dark' ? '#f1f1f1' : '#000'} />
              <Text className="text-md font-bold text-text dark:text-text-dark">Expand</Text>
            </>
          )}
        </View>
      </Pressable>
    </View>
  );
}

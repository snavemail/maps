import { View, Text, Pressable } from 'react-native';
import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';

type SearchButtonProps = any;

export default function SearchButton({ onPress }: SearchButtonProps) {
  return (
    <Pressable onPress={onPress}>
      <View className="flex flex-row items-center rounded-md bg-gray-300">
        <FontAwesome className="p-3" name="search" size={20} color="black" />
        <Text className="p-3 text-gray-500">Search for places or events</Text>
      </View>
    </Pressable>
  );
}

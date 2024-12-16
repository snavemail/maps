import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { BOTTOM_SHEET_HEADER_HEIGHT } from '~/constants/layout';

export default function MainMapBottomSheetHeader({
  journey,
  onPress,
}: {
  journey: DraftJourney;
  onPress: (locationID?: string) => void;
}) {
  return (
    <View
      className="flex-row items-center justify-between bg-white px-4"
      style={{ height: BOTTOM_SHEET_HEADER_HEIGHT }}>
      <View className="flex-1 flex-row gap-2">
        <Text className="text-lg font-semibold text-gray-900">
          {journey.title || 'Untitled Journey'}
        </Text>
      </View>

      <View className="flex-row items-center px-3">
        <FontAwesome name="map-marker" size={14} color="#696969" />
        <Text className="ml-1 text-sm text-gray-600">
          {journey.locations.length} {journey.locations.length === 1 ? 'location' : 'locations'}
        </Text>
      </View>

      <Pressable
        onPress={() => onPress(undefined)}
        className="rounded-full p-2 active:scale-95"
        hitSlop={8}>
        <FontAwesome name="plus" size={16} color="#000" />
      </Pressable>
    </View>
  );
}

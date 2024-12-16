import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import LocationMap from './LocationMap';

export default function DraftLocationPreview({
  draftLocation,
  showModal,
}: {
  draftLocation: DraftLocation;
  showModal: (id: string) => void;
}) {
  return (
    <Pressable
      onPress={() => showModal(draftLocation.id)}
      className="mb-2 overflow-hidden rounded-xl bg-white p-3 shadow-sm">
      <View className="flex-row gap-3">
        <View className="h-24 w-24 overflow-hidden rounded-lg">
          <LocationMap location={draftLocation} />
        </View>

        <View className="flex-1 justify-between">
          <View>
            <Text className="text-lg font-semibold text-gray-900" numberOfLines={1}>
              {draftLocation.position} {draftLocation.title}
            </Text>

            <View className="mt-1 flex-row items-center">
              <FontAwesome name="map-marker" size={12} color="#666" />
              <Text className="ml-1 text-sm text-gray-600" numberOfLines={1}>
                {draftLocation.address}
              </Text>
            </View>

            <View className="mt-1 flex-row items-center">
              <FontAwesome name="clock-o" size={12} color="#666" />
              <Text className="ml-1 text-sm text-gray-600">
                {new Date(draftLocation.date).toLocaleTimeString([], {
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          </View>

          <View className="mt-2 flex-row items-center justify-between">
            <View className="flex-row">
              {[...Array(5)].map((_, index) => (
                <FontAwesome
                  key={index}
                  name={index < draftLocation.rating ? 'star' : 'star-o'}
                  size={12}
                  color={index < draftLocation.rating ? '#FFD700' : '#CCCCCC'}
                  style={{ marginRight: 2 }}
                />
              ))}
            </View>

            {draftLocation.images.length > 0 && (
              <View className="flex-row items-center">
                <FontAwesome name="camera" size={12} color="#666" />
                <Text className="ml-1 text-xs text-gray-600">{draftLocation.images.length}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

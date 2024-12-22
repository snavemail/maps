import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

export default function PlaceCard({ place }: { place: LocationResult }) {
  const router = useRouter();
  const { properties } = place;
  const { name, address, place_formatted, maki } = properties;

  const navigateToDetails = () => {
    console.log('Pressed', place.geometry.coordinates, place.properties.mapbox_id);
  };

  return (
    <Pressable
      onPress={navigateToDetails}
      className="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-md">
      <View className="flex-row items-center gap-x-4">
        {/* Icon */}
        <View className="rounded-full bg-blue-100 p-3">
          <FontAwesome5 name={maki || 'map-marker-alt'} size={24} color="blue" />
        </View>
        {/* Text Content */}
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800">{name}</Text>
          <Text className="text-sm text-gray-600">{address}</Text>
          <Text className="text-sm text-gray-500">{place_formatted}</Text>
        </View>
      </View>
    </Pressable>
  );
}

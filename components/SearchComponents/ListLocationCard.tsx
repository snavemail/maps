import { View, Text, Pressable } from 'react-native';
import React from 'react';

export default function LocationCard({ location }: { location: LocationResult }) {
  const properties = location.properties;

  const onPress = () => {
    console.log('Pressed', properties.mapbox_id);
  };

  return (
    <Pressable onPress={onPress}>
      <View className="bg-gray-300">
        <Text className="text-xl font-semibold">{properties.name}</Text>
      </View>
    </Pressable>
  );
}

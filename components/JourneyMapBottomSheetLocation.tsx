import { View, Text, Image, Pressable } from 'react-native';
import React, { RefObject } from 'react';
import { Camera } from '@rnmapbox/maps';

export default function JourneyMapBottomSheetLocation({
  location,
  cameraRef,
}: {
  location: {
    title: string;
    date: string;
    description: string;
    image: string;
    coordinates: { longitude: number; latitude: number };
  };
  cameraRef: RefObject<Camera>;
}) {
  return (
    <Pressable
      onPress={() => {
        cameraRef.current?.setCamera({
          centerCoordinate: [location.coordinates.longitude, location.coordinates.latitude],
          zoomLevel: 15,
          animationDuration: 800,
        });
      }}>
      <View className="flex flex-row gap-2 p-3">
        <Image source={{ uri: location.image }} className="h-16 w-16 rounded-md border-[1px]" />
        <View className="flex flex-col">
          <Text className="text-sm font-bold">{location.title}</Text>
          <Text className="flex-1 text-xs font-light">{location.date} @ 2:43pm</Text>
          <Text className="text-xs font-medium">{location.description}</Text>
        </View>
      </View>
    </Pressable>
  );
}

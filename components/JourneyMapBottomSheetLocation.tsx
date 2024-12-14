import { View, Text, Pressable } from 'react-native';
import React, { RefObject } from 'react';
import { Camera } from '@rnmapbox/maps';
import { FontAwesome } from '@expo/vector-icons';
import LocationMap from './LocationMap';

export default function JourneyMapBottomSheetLocation({
  location,
  cameraRef,
  setLocation,
}: {
  location: LocationInfo;
  cameraRef: RefObject<Camera>;
  setLocation: (location: any) => void;
}) {
  return (
    <Pressable
      onPress={() => {
        setLocation(location);
      }}>
      <View className="flex flex-row gap-2 p-3">
        <View className="h-16 w-16 rounded-lg">
          <LocationMap location={location} />
        </View>
        {/* <Image source={{ uri: location.image }} className="h-16 w-16 rounded-md border-[1px]" /> */}
        <View className="flex flex-1 flex-col">
          <Text className="text-sm font-bold">{location.title}</Text>
          <Text className="flex-1 text-xs font-light">{location.date} @ 2:43pm</Text>
          <Text className="text-xs font-medium">{location.description}</Text>
        </View>
        <View className="items-center justify-center">
          <Pressable
            hitSlop={10}
            onPress={() => {
              cameraRef.current?.setCamera({
                centerCoordinate: [location.coordinates.longitude, location.coordinates.latitude],
                zoomLevel: 15,
                animationDuration: 800,
              });
            }}>
            <FontAwesome name="circle-o" size={30} color="black" />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

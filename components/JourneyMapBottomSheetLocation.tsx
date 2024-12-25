import { View, Text, Pressable } from 'react-native';
import React, { RefObject } from 'react';
import { Camera } from '@rnmapbox/maps';
import { NavigationIcon } from 'lucide-react-native';
import LocationMap from './Maps/LocationMap';
import { centerOnLocation } from '~/utils/MapBox';

export default function JourneyMapBottomSheetLocation({
  location,
  cameraRef,
  setLocation,
}: {
  location: LocationInfo;
  cameraRef: RefObject<Camera>;
  setLocation: (location: LocationInfo) => void;
}) {
  const dateTime = new Date(location.date);
  const formattedDate = dateTime.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = dateTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Pressable onPress={() => setLocation(location)} className="active:bg-gray-50">
      <View className="flex-row items-center gap-3 border-b border-gray-100 p-4">
        <View className="h-20 w-20 overflow-hidden rounded-lg shadow-sm">
          <LocationMap location={location} animationDuration={0} />
        </View>
        <View className="flex-1 space-y-1">
          <Text numberOfLines={1} className="text-base font-semibold text-gray-900">
            {location.title}
          </Text>

          <Text className="text-xs text-gray-500">
            {formattedDate} @ {formattedTime}
          </Text>

          {location.description && (
            <Text numberOfLines={1} className="text-sm text-gray-600">
              {location.description}
            </Text>
          )}
          <View className="flex-row items-center gap-2">
            <Text className="text-sm text-gray-600">{location.rating}</Text>
            <Text className="text-sm text-gray-600">{location.images?.length} photos</Text>
          </View>
        </View>
        <Pressable
          onPress={() => {
            centerOnLocation({
              location: {
                latitude: location.coordinates.latitude,
                longitude: location.coordinates.longitude,
              },
              cameraRef,
            });
          }}
          className="rounded-full p-2 active:bg-gray-100"
          hitSlop={8}>
          <NavigationIcon size={20} color="#374151" />
        </Pressable>
      </View>
    </Pressable>
  );
}

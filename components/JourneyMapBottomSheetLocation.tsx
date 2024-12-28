import { View, Text, Pressable } from 'react-native';
import React, { RefObject } from 'react';
import { Camera } from '@rnmapbox/maps';
import { ImageIcon, NavigationIcon, Star } from 'lucide-react-native';
import LocationMap from './Maps/LocationMap';
import { centerOnLocation } from '~/utils/MapBox';
import { useColorScheme } from 'nativewind';

export default function JourneyMapBottomSheetLocation({
  location,
  cameraRef,
  setLocation,
}: {
  location: LocationInfo;
  cameraRef: RefObject<Camera>;
  setLocation: (location: LocationInfo) => void;
}) {
  const { colorScheme } = useColorScheme();
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
    <Pressable
      onPress={() => setLocation(location)}
      className="active:bg-background-50 dark:active:bg-background-50">
      <View className="flex-row items-center gap-3 border-b border-gray-200 p-4 dark:border-gray-700">
        <View className="flex-1 space-y-1">
          <Text numberOfLines={1} className="text-base font-semibold text-text dark:text-text-dark">
            {location.title}
          </Text>

          <Text className="text-text-gray-700 text-xs dark:text-gray-200">
            {formattedDate} @ {formattedTime}
          </Text>

          {location.description && (
            <Text numberOfLines={1} className="text-text-gray-700 text-xs dark:text-gray-200">
              {location.description}
            </Text>
          )}
          <View className="flex-row items-center gap-2">
            <View className="flex-row items-center gap-1">
              <Star size={16} color={colorScheme === 'dark' ? '#f1f1f1' : '#000'} />
              <Text className="text-text-gray-700 text-xs dark:text-gray-200">
                {location.rating}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <ImageIcon size={16} color={colorScheme === 'dark' ? '#f1f1f1' : '#000'} />
              <Text className="text-text-gray-700 text-xs dark:text-gray-200">
                {location.images?.length} photos
              </Text>
            </View>
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
          <NavigationIcon size={20} color={colorScheme === 'dark' ? '#f1f1f1' : '#000'} />
        </Pressable>
      </View>
    </Pressable>
  );
}

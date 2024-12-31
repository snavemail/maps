import { View, Text, Pressable } from 'react-native';
import React, { memo, useMemo } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { getIconName, getLucideIconName } from '~/lib/utils';
import { calculateDistance } from '~/utils/MapBox';
import { useUserLocationStore } from '~/stores/useUserLocation';
import { LucideIcon } from '~/components/LucideIcon';
import { useColorScheme } from 'nativewind';

const SearchListLocationCard = ({ location }: { location: LocationResult }) => {
  const { properties, geometry } = location;
  const userLocation = useUserLocationStore((state) => state.userLocation);
  const { colorScheme } = useColorScheme();

  const onPress = () => {
    router.push({
      pathname: '/(tabs)/explore/[slug]',
      params: { slug: properties.mapbox_id },
    });
  };

  const poiCategory = useMemo(() => {
    const category = properties.poi_category?.[0] ?? 'Unknown';
    return category.charAt(0).toUpperCase() + category.slice(1);
  }, [properties.poi_category]);

  const openHours = useMemo(() => {
    if (!properties.metadata?.open_hours) return null;

    const now = new Date();
    const day = now.getDay();
    const hours = properties.metadata.open_hours.periods[day];
    if (!hours) return 'Closed';

    const open = hours.open.time;
    const close = hours.close.time;
    return `${open.slice(0, 2)}:${open.slice(2)} - ${close.slice(0, 2)}:${close.slice(2)}`;
  }, [properties.metadata?.open_hours]);

  const distance = useMemo(() => {
    if (!userLocation) return null;
    return calculateDistance(
      userLocation.lat,
      userLocation.lon,
      geometry.coordinates[1],
      geometry.coordinates[0]
    ).toFixed(1); // Rounded to 1 decimal
  }, [userLocation, geometry.coordinates]);

  return (
    <Pressable onPress={onPress}>
      <View className="flex-row overflow-hidden border-t border-gray-100 bg-background shadow-sm dark:border-gray-700 dark:bg-background-dark">
        <View className="flex-1 justify-between p-4">
          <View>
            <Text className="text-lg font-semibold text-text dark:text-text-dark">
              {properties.name}
            </Text>
            <Text className="mt-1 text-sm text-gray dark:text-gray-dark">
              {properties.place_formatted}
            </Text>
            {distance && (
              <Text className="text-sm text-gray-700 dark:text-gray-200">
                {distance} miles away
              </Text>
            )}
          </View>
          <View className="mt-2 flex-row items-center">
            <View className="flex-1 flex-row items-center gap-2 ">
              <LucideIcon
                iconName={
                  properties.poi_category[0] === 'outdoors'
                    ? getLucideIconName('park')
                    : getLucideIconName(properties.maki || 'map-marker')
                }
                size={16}
                color={colorScheme === 'dark' ? '#38BDF8' : '#0f58a0'}
              />
              <Text className="text-sm font-medium text-text dark:text-text-dark">
                {poiCategory}
              </Text>
              {openHours && (
                <Text className="text-sm text-gray dark:text-gray-dark">{openHours}</Text>
              )}
            </View>
            <Pressable
              className="rounded-full bg-primary px-3 py-1.5 dark:bg-primary-dark"
              onPress={onPress}>
              <Text className="font-medium text-white">View Details</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default memo(SearchListLocationCard);

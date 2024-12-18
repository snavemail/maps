import { View, Text, Pressable } from 'react-native';
import React, { memo, useMemo } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { getIconName } from '~/lib/utils';
import { calculateDistance } from '~/utils/MapBox';
import { useUserLocationStore } from '~/stores/useUserLocation';

const LocationCard = ({ location }: { location: LocationResult }) => {
  const { properties, geometry } = location;
  const userLocation = useUserLocationStore((state) => state.userLocation);

  const onPress = () => {
    router.push({
      pathname: '/(tabs)/search/[slug]',
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
      <View className="flex-row overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <View className="flex-1 justify-between p-4">
          <View>
            <Text className="text-lg font-semibold text-gray-900">{properties.name}</Text>
            <Text className="mt-1 text-sm text-gray-500">{properties.place_formatted}</Text>
            {distance && <Text className="text-sm text-gray-700">{distance} miles away</Text>}
          </View>
          <View className="mt-2 flex-row items-center gap-2">
            <FontAwesome
              name={getIconName(properties.maki || 'map-marker')}
              size={16}
              color="#6B7280"
            />
            <Text className="text-sm font-medium text-black">{poiCategory}</Text>
            {openHours && <Text className="text-sm text-gray-600">{openHours}</Text>}
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default memo(LocationCard);

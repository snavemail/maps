import { View, Text, Pressable, Linking } from 'react-native';
import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { getIconName } from '~/lib/utils';
import { useRouter } from 'expo-router';

export default function MapLocationCard({ location }: { location: LocationResult }) {
  const properties = location.properties;
  const geometry = location.geometry;
  const router = useRouter();

  const onPress = () => {
    router.push({ pathname: '/(tabs)/search/[slug]', params: { slug: properties.mapbox_id } });
  };

  return (
    <Pressable onPress={onPress}>
      <View className="mb-4 p-2 ">
        <View className="mb-4 flex-row items-center justify-between rounded-lg bg-white px-4 py-2">
          <View className="flex-1">
            <View className="flex-row items-center gap-2">
              <FontAwesome
                name={getIconName(properties.maki || 'map-marker')}
                size={24}
                color="#4B5563"
              />
              <Text numberOfLines={1} className="text-2xl font-bold text-gray-900">
                {properties.name}
              </Text>
            </View>
            <Text numberOfLines={1} className="text-base text-gray-500">
              {properties.place_formatted}
            </Text>
          </View>
          <View className="ml-4">
            {properties.metadata?.open_hours && (
              <View className="">
                {(() => {
                  const now = new Date();
                  const day = now.getDay();
                  const hours = properties.metadata.open_hours.periods[day];
                  const currentTime = now.getHours() * 100 + now.getMinutes();
                  if (!hours)
                    return (
                      <Text numberOfLines={1} className="text-base font-medium text-red-500">
                        Closed Today
                      </Text>
                    );
                  const openTime = parseInt(hours.open.time);
                  const closeTime =
                    parseInt(hours.close.time) < parseInt(hours.open.time)
                      ? parseInt(hours.close.time) + 2400
                      : parseInt(hours.close.time);
                  const isOpen = currentTime >= openTime && currentTime < closeTime;
                  console.log(currentTime, openTime, closeTime);
                  return (
                    <View>
                      <Text
                        numberOfLines={1}
                        className={`text-base font-medium ${isOpen ? 'text-green-500' : 'text-red-500'}`}>
                        {isOpen ? 'Open Now' : 'Closed'}
                      </Text>
                      <Text numberOfLines={1} className="mt-1 text-sm text-gray-500">
                        {hours.open.time.slice(0, 2)}:{hours.open.time.slice(2)} -{' '}
                        {hours.close.time.slice(0, 2)}:{hours.close.time.slice(2)}
                      </Text>
                    </View>
                  );
                })()}
              </View>
            )}
          </View>
        </View>
        <View className="flex-row gap-3">
          {properties.metadata?.phone && (
            <Pressable
              onPress={() => Linking.openURL(`tel:${properties?.metadata?.phone}`)}
              className="flex-1 rounded-lg bg-gray-900 p-3">
              <Text className="text-center text-white">Call</Text>
            </Pressable>
          )}
          {geometry.coordinates && (
            <Pressable
              onPress={() =>
                Linking.openURL(
                  `https://www.google.com/maps/dir/?api=1&destination=${geometry.coordinates[1]},${geometry.coordinates[0]}`
                )
              }
              className="flex-1 rounded-lg bg-gray-900 p-3">
              <Text className="text-center text-white">Directions</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Pressable>
  );
}

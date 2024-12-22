import { View, Text, Pressable, Linking } from 'react-native';
import React from 'react';
import { MapPin, Phone, Navigation2, Clock } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LucideIcon } from '~/components/LucideIcon';
import { getLucideIconName } from '~/lib/utils';

export default function SearchMapLocationCard({ location }: { location: LocationResult }) {
  const properties = location.properties;
  const geometry = location.geometry;
  const router = useRouter();

  const onPress = () => {
    router.push({ pathname: '/(tabs)/explore/[slug]', params: { slug: properties.mapbox_id } });
  };

  return (
    <Pressable onPress={onPress} className="overflow-hidden rounded-lg bg-white shadow-sm">
      <View className="p-4">
        {/* Header Section */}
        <View className="flex-row items-start justify-between">
          <View className="flex-1">
            <View className="flex-row items-center gap-2">
              <LucideIcon
                iconName={getLucideIconName(properties.maki || 'MapPin')}
                size={20}
                color="#4B5563"
              />
              <Text numberOfLines={1} className="text-lg font-bold text-gray-900">
                {properties.name}
              </Text>
            </View>
            <Text numberOfLines={2} className="mt-1 text-sm text-gray-500">
              {properties.place_formatted}
            </Text>
          </View>

          {/* Opening Hours */}
          {properties.metadata?.open_hours && (
            <View className="ml-4">
              {(() => {
                const now = new Date();
                const day = now.getDay();
                const hours = properties.metadata.open_hours.periods[day];
                const currentTime = now.getHours() * 100 + now.getMinutes();
                if (!hours)
                  return (
                    <View className="flex-row items-center">
                      <Clock size={16} color="#EF4444" />
                      <Text numberOfLines={1} className="ml-1 text-sm font-medium text-red-500">
                        Closed Today
                      </Text>
                    </View>
                  );
                const openTime = parseInt(hours.open.time);
                const closeTime =
                  parseInt(hours.close.time) < parseInt(hours.open.time)
                    ? parseInt(hours.close.time) + 2400
                    : parseInt(hours.close.time);
                const isOpen = currentTime >= openTime && currentTime < closeTime;
                return (
                  <View className="items-end">
                    <View className="flex-row items-center">
                      <Clock size={16} color={isOpen ? '#22C55E' : '#EF4444'} />
                      <Text
                        numberOfLines={1}
                        className={`ml-1 text-sm font-medium ${
                          isOpen ? 'text-green-500' : 'text-red-500'
                        }`}>
                        {isOpen ? 'Open Now' : 'Closed'}
                      </Text>
                    </View>
                    <Text numberOfLines={1} className="mt-0.5 text-xs text-gray-500">
                      {hours.open.time.slice(0, 2)}:{hours.open.time.slice(2)} -{' '}
                      {hours.close.time.slice(0, 2)}:{hours.close.time.slice(2)}
                    </Text>
                  </View>
                );
              })()}
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View className="mt-4 flex-row gap-2 border-t border-gray-100 pt-4">
          {properties.metadata?.phone && (
            <Pressable
              onPress={() => Linking.openURL(`tel:${properties?.metadata?.phone}`)}
              className="flex-1 flex-row items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 active:bg-gray-800">
              <Phone size={16} color="white" />
              <Text className="ml-2 text-sm font-medium text-white">Call</Text>
            </Pressable>
          )}
          {geometry.coordinates && (
            <Pressable
              onPress={() =>
                Linking.openURL(
                  `https://www.google.com/maps/dir/?api=1&destination=${geometry.coordinates[1]},${geometry.coordinates[0]}`
                )
              }
              className="flex-1 flex-row items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 active:bg-gray-800">
              <Navigation2 size={16} color="white" />
              <Text className="ml-2 text-sm font-medium text-white">Directions</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Pressable>
  );
}

import { MapPin, Clock } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { View, Pressable, Text } from 'react-native';
import { LucideIcon } from '../LucideIcon';
import { getLucideIconName } from '~/lib/utils';

export default function HighlightedSearchItem({ result }: { result: LocationResult }) {
  const { colorScheme } = useColorScheme();

  return (
    <View className="overflow-hidden rounded-xl bg-gray-100 shadow-lg dark:bg-gray-800">
      <View className="h-48 w-full bg-gray-200 dark:bg-gray-700">
        <View className="absolute left-4 top-4 rounded-full bg-primary/90 px-3 py-1 dark:bg-primary-dark/90">
          <Text className="text-sm font-medium text-white">Featured</Text>
        </View>
      </View>

      <View className="p-4">
        <View className="mb-3 flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-xl font-bold text-text dark:text-text-dark" numberOfLines={1}>
              {result.properties.name}
            </Text>
            <Text className="text-sm text-gray dark:text-gray-dark" numberOfLines={1}>
              {result.properties.address || result.properties.place_formatted}
            </Text>
          </View>
          <View className="ml-2 rounded-full bg-primary/10 p-2 dark:bg-primary-dark/10">
            <LucideIcon
              iconName={getLucideIconName(result.properties.maki || '')}
              size={20}
              color={colorScheme === 'dark' ? '#38BDF8' : '#0f58a0'}
            />
          </View>
        </View>

        <View className="mb-4 flex-row items-center gap-4">
          {result.properties.context.place && (
            <View className="flex-row items-center">
              <MapPin size={16} color={colorScheme === 'dark' ? '#94A3B8' : '#64748B'} />
              <Text className="ml-1 text-sm text-gray dark:text-gray-dark">
                {result.properties.context.place.name}
              </Text>
            </View>
          )}
          {result.properties.context.region && (
            <Text className="text-sm text-gray dark:text-gray-dark">
              {result.properties.context.region.name}
            </Text>
          )}
        </View>

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Clock size={16} color={colorScheme === 'dark' ? '#94A3B8' : '#64748B'} />
            <Text className="ml-1 text-sm text-gray dark:text-gray-dark">Open Now</Text>
          </View>
          <Pressable className="rounded-full bg-primary px-4 py-2 dark:bg-primary-dark">
            <Text className="font-medium text-white">View Details</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

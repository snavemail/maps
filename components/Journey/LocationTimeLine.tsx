import { Star } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { View, Text } from 'react-native';
import ImageCarousel from '~/components/ImageCarousel';
import { useColorScheme } from 'nativewind';

export default function LocationTimeline({
  journey,
  location,
  index,
}: {
  journey: JourneyWithProfile;
  location: LocationInfo;
  index: number;
}) {
  const containerRef = useRef<View>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const { colorScheme } = useColorScheme();

  return (
    <View key={location.id} className="overflow-hidden pb-2">
      <View
        className="flex-row"
        ref={containerRef}
        onLayout={(event) => {
          const totalWidth = event.nativeEvent.layout.width;
          const timelineWidth = 32;
          const padding = 10;
          setContainerWidth(totalWidth - timelineWidth - padding);
        }}>
        <View className="mr-4 items-center">
          <View className="h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
            <Text className="font-medium text-gray-700 dark:text-gray-200">{index + 1}</Text>
          </View>
          {index < journey.locations.length - 1 && (
            <View className="w-0.5 flex-1 bg-gray-200 dark:bg-gray-700" />
          )}
        </View>
        <View className="flex-1">
          <Text className="text-lg font-semibold text-text dark:text-text-dark">
            {location.title}
          </Text>
          <View className="flex-row items-center gap-x-4">
            <Text className="text-sm text-gray-700 dark:text-gray-200">
              {new Date(location.date).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
            {location.rating && (
              <View className="flex-row items-center">
                <Star size={14} color="#FFD700" fill="#FFD700" />
                <Text className="ml-1 text-sm text-gray-700 dark:text-gray-200">
                  {location.rating}
                </Text>
              </View>
            )}
          </View>
          {location.description && (
            <Text className="mt-2 text-gray-700 dark:text-gray-200">{location.description}</Text>
          )}
          <View>
            {location.images && location.images.length > 0 && containerWidth > 0 && (
              <ImageCarousel images={location.images} containerWidth={containerWidth} />
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

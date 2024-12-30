import { View, Text, ScrollView, Image } from 'react-native';
import React, { useMemo } from 'react';
import MapPreview from '~/components/Maps/MapPreview';
import { UserRound, Star } from 'lucide-react-native';
import ToProfileButton from '~/components/Buttons/ToProfileButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import LocationTimeline from './LocationTimeLine';
import ToJourneyMapButton from '~/components/Buttons/ToJourneyMapButton';
import ActionMenuJourney from '~/components/Journey/ActionMenuJourney';
import { useColorScheme } from 'nativewind';
import { useAuthStore } from '~/stores/useAuth';

export default function JourneyPage({ journey }: { journey: JourneyWithProfile }) {
  const { colorScheme } = useColorScheme();
  const self = useAuthStore((state) => state.user);

  const showActionMenu = self?.id === journey.profile.id;

  const journeyStats = useMemo(() => {
    if (!journey) {
      return null;
    }

    const firstDate = new Date(journey.start_date);
    const lastDate = new Date(journey.locations[journey.locations.length - 1].date);
    const diffTime = Math.abs(lastDate.getTime() - firstDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const photos = journey.locations.reduce((sum, loc) => sum + (loc.images?.length || 0), 0);
    const ratings = journey.locations
      .filter((loc) => loc.rating)
      .map((loc) => loc.rating as number);
    const avg = ratings.length ? ratings.reduce((a, b) => a + b) / ratings.length : 0;
    const hours = Math.ceil(diffTime / (1000 * 60 * 60));

    return {
      duration: diffDays === 0 ? `${hours} ${hours === 1 ? 'hr' : 'hrs'}` : `${diffDays} days`,
      dateRange: `${firstDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })} - ${lastDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })}`,
      totalPhotos: photos,
      averageRating: Number((Math.round(avg * 10) / 10).toFixed(1)),
    };
  }, [journey]);

  if (!journey || !journeyStats) return null;

  return (
    <ScrollView className=" bg-background dark:bg-background-dark">
      {/* Large Map Preview */}
      <ToJourneyMapButton journeyID={journey.id}>
        <View className="h-72">
          <MapPreview journey={journey} />
        </View>
      </ToJourneyMapButton>
      <View className="px-4">
        <View className="mt-4">
          <View className="flex-row items-center">
            <ToProfileButton profileID={journey.profile.id}>
              {journey.profile.avatar_url ? (
                <Image
                  source={{ uri: journey.profile.avatar_url }}
                  className="h-12 w-12 rounded-full border-2 border-white shadow-sm dark:border-black"
                />
              ) : (
                <View className="h-12 w-12 items-center justify-center rounded-full bg-gray-700 dark:bg-gray-200">
                  <UserRound size={20} color={colorScheme === 'dark' ? '#ccc' : '#444'} />
                </View>
              )}
            </ToProfileButton>
            <View className="ml-3 flex-1">
              <ToProfileButton profileID={journey.profile.id}>
                <Text className="text-base font-semibold text-text dark:text-text-dark">
                  {journey.profile.first_name} {journey.profile.last_name}
                </Text>
              </ToProfileButton>
              <Text className="text-sm text-gray-700 dark:text-gray-200">
                {journeyStats.dateRange}
              </Text>
            </View>
            {showActionMenu && (
              <View>
                <ActionMenuJourney journeyID={journey.id} />
              </View>
            )}
          </View>
        </View>

        <View className="mt-6">
          <Text className="text-2xl font-bold text-text dark:text-text-dark">{journey.title}</Text>
          {journey.description && (
            <Text className="mt-2 text-base leading-6 text-gray-700 dark:text-gray-200">
              {journey.description}
            </Text>
          )}
        </View>

        <View className="mt-6 flex-row items-center rounded-xl bg-gray-200 p-4 dark:bg-gray-700">
          <View className="flex-1 flex-col items-center">
            <Text className="text-sm text-gray-700 dark:text-gray-200">Stops</Text>
            <Text className="text-lg font-bold text-gray-900 dark:text-text-dark">
              {journey.locations.length}
            </Text>
          </View>
          <View className="flex-1 items-center">
            <Text className="text-sm text-gray-700 dark:text-gray-200">Duration</Text>
            <Text className="text-lg font-bold text-gray-900 dark:text-text-dark">
              {journeyStats.duration}
            </Text>
          </View>
          <View className="flex-1 items-center">
            <Text className="text-sm text-gray-700 dark:text-gray-200">Average Rating</Text>
            <View className="flex-row items-center justify-center gap-1">
              <Text className="text-lg font-bold text-gray-900 dark:text-text-dark">
                {journeyStats.averageRating.toFixed(1)}
              </Text>
              <Star size={12} color="#FFD700" fill="#FFD700" />
            </View>
          </View>
        </View>
        <View className="my-8">
          <Text className="mb-4 text-lg font-semibold text-text dark:text-text-dark">Timeline</Text>
          {journey.locations.map((location, index) => (
            <LocationTimeline
              key={location.id}
              journey={journey}
              location={location}
              index={index}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

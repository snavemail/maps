import { View, Text, Image } from 'react-native';
import React, { useMemo } from 'react';
import MapPreview from './Maps/MapPreview';
import { MapPin, UserRound, Star } from 'lucide-react-native';
import ToProfileButton from './Buttons/ToProfileButton';
import ToJourneyButton from './Buttons/ToJourneyButton';
import ToJourneyMapButton from './Buttons/ToJourneyMapButton';

function JourneyCard({ journey }: { journey: JourneyWithProfile }) {
  const { dateRange, averageRating } = useMemo(() => {
    const firstDate = new Date(journey.start_date);
    const lastDate = new Date(journey.locations[journey.locations.length - 1].date);
    const diffTime = Math.abs(lastDate.getTime() - firstDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // total photos across all locations
    const photos = journey.locations.reduce((sum, loc) => sum + (loc.images?.length || 0), 0);

    // average rating
    const ratings = journey.locations
      .filter((loc) => loc.rating)
      .map((loc) => loc.rating as number);
    const avg = ratings.length ? ratings.reduce((a, b) => a + b) / ratings.length : 0;

    return {
      duration: diffDays === 0 ? 'Single day' : `${diffDays} days`,
      dateRange: `${firstDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })} - ${lastDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })}`,
      totalPhotos: photos,
      averageRating: (Math.round(avg * 10) / 10).toFixed(1),
    };
  }, [journey]);

  return (
    <ToJourneyButton journeyID={journey.id}>
      <View className="mb-4 overflow-hidden bg-white p-4 shadow-sm">
        {/* Map */}
        <ToJourneyMapButton journeyID={journey.id}>
          <View className="mb-4 h-64 rounded-lg bg-gray-200">
            <MapPreview journey={journey} />
          </View>
        </ToJourneyMapButton>

        {/* User Info */}
        <View className="mb-4 flex-row items-center">
          <ToProfileButton profileID={journey.profile.id}>
            {journey.profile.avatar_url ? (
              <Image
                source={{ uri: journey.profile.avatar_url }}
                className="h-10 w-10 rounded-full"
              />
            ) : (
              <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <UserRound size={16} color="#374151" />
              </View>
            )}
          </ToProfileButton>
          <View className="ml-3">
            <View className="mb-[2px]">
              <ToProfileButton profileID={journey.profile.id}>
                <Text className="text-md font-semibold text-black">
                  {journey.profile.first_name} {journey.profile.last_name}
                </Text>
              </ToProfileButton>
            </View>
            <View>
              <Text className="text-xs text-gray-600">{dateRange}</Text>
            </View>
          </View>
        </View>
        {/* Journey Title + Description */}
        <View className="mb-4">
          <View className="">
            <Text className="text-lg font-semibold text-black">{journey.title}</Text>
          </View>
          {journey.description && (
            <View>
              <Text className="text-sm text-gray-600">{journey.description}</Text>
            </View>
          )}
        </View>

        {/* Stats */}
        <View className="flex-row justify-between">
          <View className="flex flex-row items-center gap-1">
            <MapPin size={16} color="black" fill={'white'} />
            <Text className="text-sm font-semibold text-gray-600">
              {journey.locations.length} stop{journey.locations.length === 1 ? '' : 's'}
            </Text>
          </View>
          <View className="flex flex-row items-center gap-1">
            <Star size={16} color="black" fill="yellow" />
            <Text className="text-sm font-semibold text-gray-600">{averageRating}</Text>
          </View>
        </View>
      </View>
    </ToJourneyButton>
  );
}

export default JourneyCard;

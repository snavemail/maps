import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useJourneyCache } from '~/stores/useJourneyCache';
import { journeyService } from '~/services/journeyService';
import MapPreview from '~/components/Maps/MapPreview';
import { UserRound, Star } from 'lucide-react-native';
import ToProfileButton from '../Buttons/ToProfileButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useImageStore } from '~/stores/useImage';
import SignedImage from './SignedImage';
import ImageCarousel from '../ImageCarousel';
import LocationTimeline from './LocationTimeLine';
import { JourneyContext } from '~/app/(tabs)/journeys/journey/[journeyID]/_layout';

export default function JourneyPage() {
  const { journey } = useContext(JourneyContext);

  const journeyStats = useMemo(() => {
    if (!journey) return null;

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
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className=" bg-white">
        {/* Large Map Preview */}
        <View className="h-72">
          <MapPreview journey={journey} />
        </View>
        <View className="px-4">
          <View className="mt-4">
            <ToProfileButton profileID={journey.profile.id}>
              <View className="flex-row items-center">
                {journey.profile.avatar_url ? (
                  <Image
                    source={{ uri: journey.profile.avatar_url }}
                    className="h-12 w-12 rounded-full border-2 border-white shadow-sm"
                  />
                ) : (
                  <View className="h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    <UserRound size={20} color="#374151" />
                  </View>
                )}
                <View className="ml-3">
                  <Text className="text-base font-semibold text-black">
                    {journey.profile.first_name} {journey.profile.last_name}
                  </Text>
                  <Text className="text-sm text-gray-600">{journeyStats.dateRange}</Text>
                </View>
              </View>
            </ToProfileButton>
          </View>

          <View className="mt-6">
            <Text className="text-2xl font-bold text-black">{journey.title}</Text>
            {journey.description && (
              <Text className="mt-2 text-base leading-6 text-gray-600">{journey.description}</Text>
            )}
          </View>

          <View className="mt-6 flex-row items-center rounded-xl bg-gray-100 p-4">
            <View className="flex-1 flex-col items-center">
              <Text className="text-sm text-gray-600">Stops</Text>
              <Text className="mt-1 text-lg font-bold text-gray-900">
                {journey.locations.length}
              </Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-sm text-gray-600">Duration</Text>
              <Text className="mt-1 text-lg font-bold text-gray-900">{journeyStats.duration}</Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-sm text-gray-600">Average Rating</Text>
              <View className="flex-row items-center justify-center gap-1">
                <Text className="mt-1 text-lg font-bold text-gray-900">
                  {journeyStats.averageRating.toFixed(1)}
                </Text>
                <Star size={12} color="#FFD700" fill="#FFD700" />
              </View>
            </View>
          </View>
          <View className="my-8">
            <Text className="mb-4 text-lg font-semibold text-black">Timeline</Text>
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
    </SafeAreaView>
  );
}

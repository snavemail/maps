import { View, Text, Pressable, Image } from 'react-native';
import React, { useMemo } from 'react';
import MapPreview from './MapPreview';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

function JourneyPreview({ journey }: { journey: JourneyWithProfile }) {
  const router = useRouter();

  // Calculate duration and format dates
  const { duration, dateRange } = useMemo(() => {
    const firstDate = new Date(journey.start_date);
    const lastDate = new Date(journey.end_date);
    const diffTime = Math.abs(lastDate.getTime() - firstDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

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
    };
  }, [journey.start_date, journey.end_date]);

  return (
    <View className="mb-4 overflow-hidden rounded-lg bg-white shadow-sm">
      <Pressable
        className="overflow-hidden"
        style={({ pressed }) => (pressed ? { opacity: 0.9 } : {})}>
        <View className="flex-row items-center px-4 pb-2 pt-3">
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1522163182402-834f871fd851' }}
            className="h-8 w-8 rounded-full"
          />
          <View className="ml-2 flex-1">
            <Text className="font-medium text-gray-900">Mr. TODO</Text>
            <Text className="text-xs text-gray-500">{dateRange}</Text>
          </View>
        </View>

        {/* Journey Info */}
        <View className="p-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-bold text-gray-900">{journey.title}</Text>
            <View className="flex-row items-center">
              <FontAwesome name="map-marker" size={14} color="#666" />
              <Text className="ml-1 text-sm text-gray-600">
                {journey.locations.length} locations
              </Text>
            </View>
          </View>

          {/* Duration */}
          <View className="mb-3 mt-1 flex-row items-center">
            <FontAwesome name="clock-o" size={14} color="#666" />
            <Text className="ml-1 text-sm text-gray-600">{duration}</Text>
          </View>

          {/* Description */}
          {journey.description && (
            <Text numberOfLines={2} className="text-sm text-gray-600">
              {journey.description}
            </Text>
          )}
        </View>

        {/* Map */}
        <Pressable onPress={() => router.push(`/journey/${journey.id}`)}>
          <View className="h-48">
            <MapPreview journey={journey} />
          </View>
        </Pressable>

        {/* Preview Images */}
        {/* {previewImages.length > 0 && (
          <View className="px-4 py-2">
            <View className="flex-row gap-2">
              {previewImages.map((image: any, index: React.Key | null | undefined) => (
                <View key={index} className="aspect-square flex-1 overflow-hidden rounded-lg">
                  <Image source={{ uri: image }} className="h-full w-full" resizeMode="cover" />
                </View>
              ))}
              {journey.totalImages > 3 && (
                <View className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-1">
                  <Text className="text-xs font-medium text-white">+{journey.totalImages - 3}</Text>
                </View>
              )}
            </View>
          </View>
        )} */}
      </Pressable>

      {/* Action Buttons
      <View className="flex-row border-t border-gray-100">
        <Pressable
          className="flex-1 flex-row items-center justify-center py-3"
          style={({ pressed }) => (pressed ? { opacity: 0.7 } : {})}>
          <FontAwesome
            name={journey.isLiked ? 'heart' : 'heart-o'}
            size={16}
            color={journey.isLiked ? '#FF4444' : '#666'}
          />
          <Text className="ml-2 text-sm text-gray-600">{journey.likes || 0}</Text>
        </Pressable>

        <Pressable
          className="flex-1 flex-row items-center justify-center py-3"
          style={({ pressed }) => (pressed ? { opacity: 0.7 } : {})}>
          <FontAwesome name="comment-o" size={16} color="#666" />
          <Text className="ml-2 text-sm text-gray-600">{journey.comments || 0}</Text>
        </Pressable>

        <Pressable
          className="flex-1 flex-row items-center justify-center py-3"
          style={({ pressed }) => (pressed ? { opacity: 0.7 } : {})}>
          <FontAwesome name="share" size={16} color="#666" />
        </Pressable>
      </View> */}
    </View>
  );
}

export default JourneyPreview;

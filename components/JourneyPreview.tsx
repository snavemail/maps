import { View, Text, Pressable } from 'react-native';
import React from 'react';
import MapPreview from './MapPreview';
import { useRouter } from 'expo-router';

function JourneyPreview({ journey }: any) {
  const router = useRouter();
  return (
    <Pressable onPress={() => router.push(`/journey/${journey.journeyID}`)}>
      <View className="min-h-80 min-w-full rounded-lg bg-gray-300 py-3">
        <Text className="text-lg font-bold">{journey.title}</Text>
        <Text className="text-sm">{journey.description}</Text>
        <MapPreview journey={journey} />
      </View>
    </Pressable>
  );
}

export default JourneyPreview;

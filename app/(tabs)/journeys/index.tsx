import { View, Text, FlatList, RefreshControl, Animated, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { journeyService } from '~/services/journeyService';
import { useAuthStore } from '~/stores/useAuth';
import JourneyPreview from '~/components/JourneyPreview';

function ShimmerEffect() {
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={{
        ...StyleSheet.absoluteFillObject,
        opacity,
        backgroundColor: '#ffffff',
      }}
    />
  );
}

function JourneyPreviewSkeleton() {
  return (
    <View className="mb-4 overflow-hidden rounded-2xl bg-white p-4 shadow-sm">
      <ShimmerEffect />
      <View className="mb-4 h-64 rounded-lg bg-gray-200" />
      <View className="mb-4 flex-row items-center">
        <View className="h-10 w-10 rounded-full bg-gray-200" />
        <View className="ml-3 flex-1">
          <View className="mb-2 h-4 w-32 rounded bg-gray-200" />
          <View className="h-3 w-24 rounded bg-gray-200" />
        </View>
      </View>
      <View className="mb-4">
        <View className="mb-2 h-6 w-3/4 rounded bg-gray-200" />
        <View className="h-4 w-full rounded bg-gray-200" />
      </View>

      <View className="flex-row justify-between">
        <View className="h-4 w-20 rounded bg-gray-200" />
        <View className="h-4 w-20 rounded bg-gray-200" />
      </View>
    </View>
  );
}

function LoadingScreen() {
  return (
    <FlatList
      data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
      renderItem={() => <JourneyPreviewSkeleton />}
      keyExtractor={(item) => item.toString()}
      contentContainerStyle={{ padding: 0 }}
    />
  );
}

export default function Journeys() {
  const [journeys, setJourneys] = useState<JourneyWithProfile[]>([]);
  const profile = useAuthStore((state) => state.profile);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMyJourneys();
  }, []);

  const fetchMyJourneys = async (): Promise<void> => {
    setLoading(true);
    const myJourneys = await journeyService.fetchMyJourneys();
    setJourneys(myJourneys);
    setLoading(false);
  };

  const onRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await fetchMyJourneys();
    setRefreshing(false);
  };

  if (!profile) {
    return null;
  }

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <FlatList
        data={journeys}
        renderItem={({ item }: { item: JourneyWithProfile }) => <JourneyPreview journey={item} />}
        keyExtractor={(item: JourneyWithProfile) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </>
  );
}

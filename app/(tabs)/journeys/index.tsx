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
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 20;

  useEffect(() => {
    fetchInitialJourneys();
  }, []);

  const fetchInitialJourneys = async (): Promise<void> => {
    setLoading(true);
    try {
      const result = await journeyService.fetchMyJourneys(0, LIMIT);
      setJourneys(result.journeys);
      setHasMore(result.has_more);
      setPage(0);
    } catch (error) {
      console.error('Error fetching initial journeys:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreJourneys = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const result = await journeyService.fetchMyJourneys(nextPage, LIMIT);

      if (result.journeys.length > 0) {
        setJourneys((prev) => [...prev, ...result.journeys]);
        setHasMore(result.has_more);
        setPage(nextPage);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more journeys:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const onRefresh = async (): Promise<void> => {
    setRefreshing(true);
    try {
      await journeyService.refreshMyJourneys(0, LIMIT);
      await fetchInitialJourneys();
    } catch (error) {
      console.error('Error refreshing journeys:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderItem = ({ item }: { item: JourneyWithProfile | null }) => {
    if (item === null) {
      return <JourneyPreviewSkeleton />;
    }
    return <JourneyPreview journey={item} />;
  };

  if (!profile) {
    return null;
  }

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <FlatList
      data={[
        ...journeys,
        ...(loadingMore ? [null, null] : []), // Skeleton loaders for pagination
      ]}
      renderItem={renderItem}
      keyExtractor={(item, index) => item?.id || `loading-${index}`}
      onEndReached={loadMoreJourneys}
      onEndReachedThreshold={0.5}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      ListEmptyComponent={() => (
        <View className="flex-1 items-center justify-center p-4">
          <Text className="text-gray-500">No journeys found</Text>
        </View>
      )}
      ListFooterComponent={() =>
        loadingMore ? (
          <View className="py-4">
            <JourneyPreviewSkeleton />
            <JourneyPreviewSkeleton />
          </View>
        ) : null
      }
    />
  );
}

import { View, Text, FlatList } from 'react-native';
import React from 'react';
import JourneyCard from '~/components/JourneyCard';
import { useJourney } from '~/hooks/useJourney';
import { InfiniteData } from '@tanstack/react-query';
import { journeys } from '~/data/journeys';

function JourneyPreviewSkeleton() {
  return (
    <View className="mb-4 overflow-hidden rounded-2xl bg-white p-4 shadow-sm">
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
  const { data, isLoading, fetchNextPage, hasNextPage } = useJourney();

  const getJourneys = (data: InfiniteData<JourneyResponse> | undefined) => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page: JourneyResponse) => page.journeys);
  };

  const renderItem = ({ item }: { item: JourneyWithProfile | null }) => {
    if (item === null) {
      return <JourneyPreviewSkeleton />;
    }
    return <JourneyCard journey={item} />;
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <FlatList
      data={getJourneys(data)}
      renderItem={renderItem}
      keyExtractor={(item, index) => (item ? item.id : `loading-${index}`)}
      onEndReached={() => {
        if (hasNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
      // refreshControl={<RefreshControl  />}
      ListEmptyComponent={() => (
        <View className="flex-1 items-center justify-center p-4">
          <Text className="text-gray-500">No journeys yet</Text>
        </View>
      )}
      ListFooterComponent={() => {
        return isLoading && <JourneyPreviewSkeleton />;
      }}
    />
  );
}

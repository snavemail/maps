import { View, Text, FlatList } from 'react-native';
import React from 'react';
import JourneyCard from '~/components/JourneyCard';
import { InfiniteData } from '@tanstack/react-query';
import { useFollowerJourneys } from '~/hooks/useFollowerJourneys';

function JourneyPreviewSkeleton() {
  return (
    <View className="mb-4 overflow-hidden rounded-2xl bg-background p-4 shadow-sm dark:bg-background-dark">
      <View className="mb-4 h-64 rounded-lg bg-gray-200 dark:bg-gray-700" />
      <View className="mb-4 flex-row items-center">
        <View className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
        <View className="ml-3 flex-1">
          <View className="mb-2 h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
          <View className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700" />
        </View>
      </View>
      <View className="mb-4">
        <View className="mb-2 h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
        <View className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
      </View>

      <View className="flex-row justify-between">
        <View className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" />
        <View className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" />
      </View>
    </View>
  );
}

function LoadingScreen() {
  return (
    <FlatList
      data={[1, 2, 3]}
      renderItem={() => <JourneyPreviewSkeleton />}
      keyExtractor={(item) => item.toString()}
      contentContainerStyle={{ padding: 0 }}
    />
  );
}

export default function Feed() {
  const { data, isLoading, fetchNextPage, hasNextPage } = useFollowerJourneys();
  console.log('data', data);

  const getJourneys = (data: InfiniteData<JourneyResponse> | undefined) => {
    console.log('data', data?.pages[0]);
    if (data?.pages[0].journeys === null && data?.pages.length === 1) {
      return [];
    }
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
      ListEmptyComponent={() => (
        <View className="flex-1 items-center justify-center p-4">
          <Text className="text-gray dark:text-gray-dark">No journeys</Text>
        </View>
      )}
      ListFooterComponent={() => {
        return isLoading && <JourneyPreviewSkeleton />;
      }}
    />
  );
}

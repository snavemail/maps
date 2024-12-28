import { View, Text, ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import React from 'react';
import { useFollowing } from '~/hooks/useConnections';
import ConnectionCard from './ConnectionCard';
import { InfiniteData } from '@tanstack/react-query';
import { useColorScheme } from 'nativewind';

export default function Following({ userID }: { userID: string }) {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch, isRefetching } =
    useFollowing(userID as string);
  const { colorScheme } = useColorScheme();

  if (isLoading)
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark">
        <ActivityIndicator size="large" color={colorScheme === 'dark' ? '#f1f1f1' : '#000'} />
      </View>
    );

  const getFollowing = (data: InfiniteData<FollowResponse> | undefined) => {
    if (data?.pages.length === 1 && data?.pages[0].following === null) {
      return [];
    }
    if (!data) {
      return [];
    }
    return data.pages.flatMap((page: FollowResponse) => page.following);
  };

  return (
    <FlatList
      className="bg-background dark:bg-background-dark"
      data={getFollowing(data)}
      renderItem={({ item }) => <ConnectionCard user={item} />}
      ItemSeparatorComponent={() => <View className="h-px bg-gray-100" />}
      onEndReached={() => {
        if (hasNextPage) {
          fetchNextPage();
        }
      }}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      ListEmptyComponent={() => (
        <View className="p-4">
          <Text className="text-center text-gray-500">No following yet</Text>
        </View>
      )}
      ListFooterComponent={() => (isFetchingNextPage ? <ActivityIndicator /> : null)}
    />
  );
}

import { View, Text, ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import React from 'react';
import { useFollowers } from '~/hooks/useConnections';
import ConnectionCard from './ConnectionCard';
import { InfiniteData } from '@tanstack/react-query';

export default function Followers({ userID }: { userID: string }) {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch, isRefetching } =
    useFollowers(userID as string);

  if (isLoading) return <ActivityIndicator />;
  const getFollowers = (data: InfiniteData<FollowResponse> | undefined) => {
    if (data?.pages.length === 1 && data.pages[0].followers === null) {
      return [];
    }
    if (!data) {
      return [];
    }
    return data.pages.flatMap((page: FollowResponse) => page.followers);
  };

  return (
    <FlatList
      data={getFollowers(data)}
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
          <Text className="text-center text-gray-500">No followers yet</Text>
        </View>
      )}
      ListFooterComponent={() => (isFetchingNextPage ? <ActivityIndicator /> : null)}
    />
  );
}

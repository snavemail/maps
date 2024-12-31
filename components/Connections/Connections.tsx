import { View, Text, ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import React from 'react';
import { useFollowers, useFollowing } from '~/hooks/useConnections';
import ConnectionCard from './ConnectionCard';
import { InfiniteData } from '@tanstack/react-query';
import { colorScheme, useColorScheme } from 'nativewind';

export default function Connections({
  userID,
  connectionType,
}: {
  userID: string;
  connectionType: 'followers' | 'following';
}) {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch, isRefetching } =
    connectionType === 'followers'
      ? useFollowers(userID as string)
      : useFollowing(userID as string);
  const { colorScheme } = useColorScheme();

  if (isLoading)
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark">
        <ActivityIndicator size="large" color={colorScheme === 'dark' ? '#f1f1f1' : '#000'} />
      </View>
    );
  const getConnections = (
    data: InfiniteData<FollowResponse> | undefined,
    connectionType: 'followers' | 'following'
  ) => {
    if (connectionType === 'followers') {
      if (!data?.pages) {
        return [];
      }
      if (data?.pages.length === 1 && data.pages[0].followers === null) {
        return [];
      }

      return data.pages.flatMap((page: FollowResponse) => page.followers ?? []);
    } else {
      if (!data?.pages) {
        return [];
      }
      if (data?.pages.length === 1 && data.pages[0].following === null) {
        return [];
      }
      return data.pages.flatMap((page: FollowResponse) => page.following ?? []);
    }
  };

  return (
    <FlatList
      className="bg-background dark:bg-background-dark"
      data={getConnections(data, connectionType)}
      renderItem={({ item }) => <ConnectionCard user={item} />}
      ItemSeparatorComponent={() => <View className="h-px bg-gray-200 dark:bg-gray-700" />}
      onEndReached={() => {
        if (hasNextPage) {
          fetchNextPage();
        }
      }}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      ListEmptyComponent={() => (
        <View className="p-4">
          <Text className="text-center text-gray-500">
            {connectionType === 'followers'
              ? 'You have no followers yet'
              : 'You are not following anyone yet'}
          </Text>
        </View>
      )}
      ListFooterComponent={() => (isFetchingNextPage ? <ActivityIndicator /> : null)}
    />
  );
}

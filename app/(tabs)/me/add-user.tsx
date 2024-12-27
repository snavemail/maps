import { InfiniteData } from '@tanstack/react-query';
import React, { useState } from 'react';
import { View, TextInput, FlatList, ActivityIndicator, Text } from 'react-native';
import ConnectionCard from '~/components/Connections/ConnectionCard';
import { useDebounce } from '~/hooks/hooks';
import { useUserSearch } from '~/hooks/useUserSearch';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 300); // Debounce search input

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useUserSearch(debouncedQuery);

  const getUsers = (data: InfiniteData<SearchResponse> | undefined) => {
    if (data?.pages?.length === 1 && data.pages[0].users === null) return [];
    if (!data?.pages) return [];
    return data.pages.flatMap((page: SearchResponse) => page.users);
  };

  return (
    <View className="flex-1 bg-white">
      <View className="border-b border-gray-200 p-4">
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search people..."
          className="rounded-lg bg-gray-100 px-4 py-2"
          autoCapitalize="none"
        />
      </View>
      <FlatList
        data={getUsers(data)}
        renderItem={({ item }) => <ConnectionCard user={item} />}
        ItemSeparatorComponent={() => <View className="h-px bg-gray-100" />}
        keyExtractor={(item) => item.id}
        onEndReached={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
        ListEmptyComponent={() => (
          <View className="p-4">
            <Text className="text-center text-gray-500">
              {searchQuery.length === 0
                ? "Try searching for someone's name"
                : isLoading
                  ? 'Searching...'
                  : 'No results found'}
            </Text>
          </View>
        )}
        ListFooterComponent={() => (isFetchingNextPage ? <ActivityIndicator /> : null)}
      />
    </View>
  );
}

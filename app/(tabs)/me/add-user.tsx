import { InfiniteData } from '@tanstack/react-query';
import { useColorScheme } from 'nativewind';
import React, { useState } from 'react';
import { View, TextInput, FlatList, ActivityIndicator, Text } from 'react-native';
import ConnectionCard from '~/components/Connections/ConnectionCard';
import { useDebounce } from '~/hooks/hooks';
import { useUserSearch } from '~/hooks/useUserSearch';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 300);
  const { colorScheme } = useColorScheme();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useUserSearch(debouncedQuery);

  const getUsers = (data: InfiniteData<SearchResponse> | undefined) => {
    if (data?.pages?.length === 1 && data.pages[0].users === null) return [];
    if (!data?.pages) return [];
    return data.pages.flatMap((page: SearchResponse) => page.users);
  };

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <View className=" border-gray dark:border-gray-dark border-b p-4">
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search people..."
          placeholderTextColor={colorScheme === 'dark' ? '#ccc' : '#444'}
          className="text-gray dark:text-gray-dark rounded-lg bg-gray-100 px-4 py-2 dark:bg-[#4f4f4f]"
          autoCapitalize="none"
        />
      </View>
      <FlatList
        data={getUsers(data)}
        renderItem={({ item }) => <ConnectionCard user={item} />}
        ItemSeparatorComponent={() => <View className="h-px" />}
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
                ? "Try searching for someone's name like 'Liam'"
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

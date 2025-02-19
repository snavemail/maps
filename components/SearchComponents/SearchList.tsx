import { View, Text, FlatList, SafeAreaView } from 'react-native';
import React, { memo, useCallback } from 'react';
import SearchListLocationCard from '~/components/SearchComponents/SearchListLocationCard';

const SearchList = ({ results }: { results: LocationResult[] }) => {
  const renderItem = useCallback(
    ({ item }: { item: LocationResult }) => <SearchListLocationCard location={item} />,
    []
  );
  const keyExtractor = useCallback((item: LocationResult) => item.properties.mapbox_id, []);

  return (
    <SafeAreaView
      className="flex-1 bg-background dark:bg-background-dark"
      style={{ marginTop: 100 }}>
      <FlatList
        data={results}
        renderItem={renderItem}
        ListHeaderComponent={() => (
          <View className="flex-row items-center justify-between px-4">
            <Text className="text-2xl font-bold text-text dark:text-text-dark">Nearby Places</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        windowSize={5}
        getItemLayout={(_, index) => ({
          length: 100,
          offset: 100 * index,
          index,
        })}
        ListEmptyComponent={memo(() => (
          <View className="flex-1 items-start justify-center px-4">
            <Text className="items-center text-center text-lg font-bold text-text dark:text-text-dark">
              Click a category!
            </Text>
          </View>
        ))}
        keyExtractor={keyExtractor}
      />
    </SafeAreaView>
  );
};

export default memo(SearchList);

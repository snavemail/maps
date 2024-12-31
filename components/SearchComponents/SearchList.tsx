import { View, Text, FlatList, SafeAreaView } from 'react-native';
import React, { memo, useCallback } from 'react';
import SearchListLocationCard from './SearchListLocationCard';
import { useUserLocationStore } from '~/stores/useUserLocation';

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
        ListHeaderComponent={memo(() => (
          <View className="bg-background p-2 dark:bg-background-dark">
            <Text className="text-2xl font-bold text-text dark:text-text-dark">Highlighted</Text>
          </View>
        ))}
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
          <View className="flex-1 items-center justify-center">
            <Text className="items-center text-center text-lg font-bold text-text dark:text-text-dark">
              Click a category to find more stuff nearby!
            </Text>
          </View>
        ))}
        keyExtractor={keyExtractor}
      />
    </SafeAreaView>
  );
};

export default memo(SearchList);

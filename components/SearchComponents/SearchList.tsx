import { View, Text, FlatList, SafeAreaView } from 'react-native';
import React, { memo, useCallback } from 'react';
import LocationCard from './ListLocationCard';
import { useUserLocationStore } from '~/stores/useUserLocation';

const SearchList = ({ results }: { results: LocationResult[] }) => {
  const userLocation = useUserLocationStore((state) => state.userLocation);
  const renderItem = useCallback(
    ({ item }: { item: LocationResult }) => <LocationCard location={item} />,
    []
  );

  const keyExtractor = useCallback((item: LocationResult) => item.properties.mapbox_id, []);

  return (
    <SafeAreaView className="flex-1 bg-white" style={{ marginTop: 56 }}>
      <FlatList
        data={results}
        renderItem={renderItem}
        ListHeaderComponent={memo(() => (
          <View className="p-2">
            <Text className="text-2xl font-bold">Places Near You</Text>
          </View>
        ))}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={50} // Slightly increased for smoother updates.
        initialNumToRender={10} // Start with more items for better perceived performance.
        windowSize={5} // Increase window size for smoother scrolling.
        getItemLayout={(_, index) => ({
          length: 100,
          offset: 100 * index,
          index,
        })}
        keyExtractor={keyExtractor}
      />
    </SafeAreaView>
  );
};

export default memo(SearchList);

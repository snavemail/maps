import { View, Text, FlatList, SafeAreaView } from 'react-native';
import React, { memo, useCallback } from 'react';
import SearchListLocationCard from './SearchListLocationCard';
import { useUserLocationStore } from '~/stores/useUserLocation';

const SearchList = ({ results }: { results: LocationResult[] }) => {
  const userLocation = useUserLocationStore((state) => state.userLocation);
  const renderItem = useCallback(
    ({ item }: { item: LocationResult }) => <SearchListLocationCard location={item} />,
    []
  );

  const keyExtractor = useCallback((item: LocationResult) => item.properties.mapbox_id, []);

  return (
    <SafeAreaView className="flex-1 bg-white" style={{ marginTop: 56 }}>
      <FlatList
        data={results}
        renderItem={renderItem}
        ListHeaderComponent={memo(() => (
          <View className="bg-white p-2">
            <Text className="text-2xl font-bold">Places Near You</Text>
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
        keyExtractor={keyExtractor}
      />
    </SafeAreaView>
  );
};

export default memo(SearchList);

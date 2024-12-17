import { View, Text, FlatList, SafeAreaView, SectionList } from 'react-native';
import React, { useEffect } from 'react';
import { router } from 'expo-router';
import SearchButton from '../SearchButton';
import LocationCard from './ListLocationCard';

interface SectionData {
  title: string;
  data: LocationResult[][];
}

export default function SearchList({ results }: { results: LocationResult[] }) {
  const renderItem = ({ item, section }: { item: LocationResult[]; section: SectionData }) => (
    <View className="py-2">
      <Text className="mb-2 text-lg font-semibold">{section.title}</Text>
      <FlatList
        data={item}
        keyExtractor={(item) => item.properties.mapbox_id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10 }}
        renderItem={({ item: location }) => <LocationCard location={location} />}
      />
    </View>
  );

  const renderHeader = () => (
    <View className="mb-2">
      <Text className="text-2xl font-bold">Search</Text>
    </View>
  );

  const renderSectionHeader = () => (
    <View className="bg-white py-2">
      <SearchButton onPress={() => router.replace('/(tabs)/search/results')} />
    </View>
  );
  console.log(results.length);

  return (
    <SafeAreaView className="flex-1 bg-white px-3">
      <SectionList<LocationResult[], SectionData>
        sections={[
          {
            title: 'Nearby',
            data: [results],
          },
        ]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ListHeaderComponent={renderHeader}
        stickySectionHeadersEnabled
        contentContainerStyle={{ gap: 10 }}
      />
    </SafeAreaView>
  );
}

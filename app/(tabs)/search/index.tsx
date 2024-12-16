import { Pressable, View, Text, ScrollView, FlatList, SectionList } from 'react-native';
import React, { useState } from 'react';
import SearchButton from '~/components/SearchButton';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { singleCategories } from '~/constants/mapbox';
import { FontAwesome } from '@expo/vector-icons';

export default function Search() {
  const data = [1, 2, 3, 4, 5, 6, 7, 8];
  const [view, setView] = useState<'map' | 'list'>('list');
  const router = useRouter();

  return (
    <>
      <Pressable
        onPress={() => setView(view === 'map' ? 'list' : 'map')}
        className="absolute bottom-8 right-8 z-50 active:scale-95">
        <View className="min-w-24 flex-row items-center justify-center gap-2 rounded-full border-2 bg-white px-3 py-2">
          <FontAwesome name={view === 'map' ? 'th-list' : 'map'} size={12} color="black" />

          <Text className="text-lg font-semibold">{view === 'map' ? 'List' : 'Map'}</Text>
        </View>
      </Pressable>
      <SafeAreaView className=" bg-white px-3">
        <SectionList
          keyExtractor={(i) => i}
          ListHeaderComponent={() => (
            <View className="mb-2">
              <Text className="text-2xl font-bold">Search</Text>
            </View>
          )}
          renderSectionHeader={() => (
            <View className="bg-white py-2 ">
              <SearchButton onPress={() => router.replace('/(tabs)/search/results')} />
            </View>
          )}
          contentContainerStyle={{ gap: 10 }}
          renderItem={({ item }) => (
            <View className="">
              <Text className="text-lg font-semibold">{item.toUpperCase()}</Text>
              <FlatList
                data={data}
                keyExtractor={(item) => item.toString()}
                horizontal
                contentContainerStyle={{ gap: 10 }}
                renderItem={({ item }) => (
                  <Pressable>
                    <View className="h-32 w-32 rounded-lg bg-blue-300" />
                  </Pressable>
                )}
              />
            </View>
          )}
          sections={[{ data: singleCategories }]}
          stickySectionHeadersEnabled={true}
        />
      </SafeAreaView>
    </>
  );
}

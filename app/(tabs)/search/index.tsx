import { Pressable, View, Text, ScrollView, FlatList, SectionList } from 'react-native';
import React from 'react';
import SearchButton from '~/components/SearchButton';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Search() {
  const data = [1, 2, 3, 4, 5, 6, 7, 8];
  const categories: any[] = ['Parks', 'Restaurants', 'Events', 'Landmarks', 'Museums', 'Bars'];

  const router = useRouter();
  return (
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
        renderItem={({ item }) => (
          <View className="">
            <Text className="mb-2 text-lg font-semibold">{item}</Text>
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
        sections={[{ data: categories }]}
        stickySectionHeadersEnabled={true}
      />
    </SafeAreaView>
  );
}

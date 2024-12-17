import { Pressable, View, Text, ScrollView, FlatList, SectionList } from 'react-native';
import React, { useEffect, useState } from 'react';
import SearchButton from '~/components/SearchButton';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { singleCategories } from '~/constants/mapbox';
import { FontAwesome } from '@expo/vector-icons';
import SearchMap from '~/components/SearchComponents/SearchMap';
import SearchList from '~/components/SearchComponents/SearchList';
import { results } from '~/data/poi';

export default function Search() {
  const [view, setView] = useState<'map' | 'list'>('list');

  useEffect(() => {
    console.log('Search mounted');
    return () => {
      console.log('Search unmounted');
    };
  }, []);

  return (
    <>
      <Pressable
        onPress={() => setView(view === 'map' ? 'list' : 'map')}
        className="absolute bottom-8 right-8 z-50 active:scale-95">
        <View className="min-w-24 flex-row items-center justify-center gap-2 rounded-lg border-2 bg-white px-3 py-2">
          <FontAwesome name={view === 'map' ? 'th-list' : 'map'} size={12} color="black" />

          <Text className="text-lg font-semibold">{view === 'map' ? 'List' : 'Map'}</Text>
        </View>
      </Pressable>
      {view === 'list' ? <SearchList results={results} /> : <SearchMap results={results} />}
    </>
  );
}

import { Pressable, View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import SearchMap from '~/components/Maps/SearchMap';
import SearchList from '~/components/SearchComponents/SearchList';
import { results } from '~/data/poi';
import { useSearchStore } from '~/stores/useSearch';
import SearchMapLocationCard from '~/components/SearchComponents/SearchMapLocationCard';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { ScrollView } from 'react-native-gesture-handler';
import { calculateDistance } from '~/utils/MapBox';
import { useUserLocationStore } from '~/stores/useUserLocation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LucideIcon } from '~/components/LucideIcon';

export default function Explore() {
  const [view, setView] = useState<'map' | 'list'>('list');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'restaurant',
    'bar',
    'park',
  ]);
  const [filteredResults, setFilteredResults] = useState<any>([]);
  const userLocation = useUserLocationStore((state) => state.userLocation);
  const selectedResult = useSearchStore((state) => state.selectedResult);
  const setSelectedResult = useSearchStore((state) => state.setSelectedResult);
  const [cardHeight, setCardHeight] = useState(0);
  const insets = useSafeAreaInsets();

  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(0);
  const buttonTranslateY = useSharedValue(0);

  const animatedCardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardTranslateY.value * -1 }],
  }));

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: buttonTranslateY.value * -1 }],
  }));

  useEffect(() => {
    let filtered = results.filter((result) =>
      selectedCategories.some((category) => result.properties.poi_category.includes(category))
    );

    if (userLocation) {
      filtered = filtered.sort((a, b) => {
        const distA = calculateDistance(
          userLocation?.lat,
          userLocation?.lon,
          a.geometry.coordinates[1],
          a.geometry.coordinates[0]
        );
        const distB = calculateDistance(
          userLocation?.lat,
          userLocation?.lon,
          b.geometry.coordinates[1],
          b.geometry.coordinates[0]
        );
        return distA - distB;
      });
    }

    setFilteredResults(filtered);
  }, [selectedCategories]);

  const handleCardAnimation = () => {
    if (selectedResult && view === 'map') {
      buttonTranslateY.value = withTiming(140, { duration: 200 });
      cardOpacity.value = withTiming(1, { duration: 200 });
      cardTranslateY.value = withDelay(200, withTiming(0, { duration: 200 }));
    } else {
      cardOpacity.value = withTiming(0, { duration: 200 });
      cardTranslateY.value = withTiming(0, { duration: 200 });
      buttonTranslateY.value = withTiming(0, { duration: 200 });
    }
  };

  useEffect(() => {
    handleCardAnimation();
  }, [selectedResult, view, cardHeight]);

  const categories = [
    {
      id: 'restaurant',
      name: 'Restaurants',
    },
    {
      id: 'bar',
      name: 'Bars',
    },
    {
      id: 'park',
      name: 'Parks',
    },
  ];

  const onCategoryPress = (id: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(id)) {
        return prev.filter((category) => category !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  return (
    <>
      <View
        style={{
          position: 'relative',
          zIndex: 1000,
          marginTop: insets.top + 8, // Push below the safe area
        }}>
        <ScrollView
          horizontal
          bounces
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
          }}>
          <View
            className={`flex items-center justify-center rounded-lg border px-2 py-[2px] active:bg-blue-50`}>
            <Text className="text-sm font-semibold">All</Text>
          </View>
          {categories.map((category) => (
            <View
              key={category.id}
              className={`flex items-center justify-center rounded-lg border ${
                selectedCategories.includes(category.id) ? 'bg-blue-200' : 'bg-white'
              } px-2 py-[2px] active:bg-blue-50`}>
              <Pressable
                onPress={() => {
                  onCategoryPress(category.id);
                }}>
                <Text className="text-sm font-semibold">{category.name}</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
      </View>

      <View className="absolute bottom-8 right-8 z-50 flex-col items-end gap-y-4">
        <Animated.View style={animatedButtonStyle}>
          <Pressable onPress={() => setView((prev) => (prev === 'map' ? 'list' : 'map'))}>
            <View className="min-w-24 max-w-24 flex-row items-center justify-center gap-2 rounded-lg border-2 bg-white px-3 py-2">
              <LucideIcon
                iconName={view === 'map' ? 'List' : 'MapPinned'}
                size={19}
                color="black"
              />
              <Text className="text-lg font-semibold">{view === 'map' ? 'List' : 'Map'}</Text>
            </View>
          </Pressable>
        </Animated.View>
      </View>

      <View className="absolute bottom-4 z-50 w-full">
        {selectedResult && view === 'map' && (
          <Animated.View
            style={[
              {
                width: '100%',
                paddingHorizontal: 16,
              },
              animatedCardStyle,
            ]}>
            <SearchMapLocationCard location={selectedResult} />
          </Animated.View>
        )}
      </View>
      <View
        className="bg-white"
        style={[styles.fullSize, { display: view === 'list' ? 'flex' : 'none' }]}>
        <SearchList results={filteredResults} />
      </View>
      <View style={[styles.fullSize, { display: view === 'map' ? 'flex' : 'none' }]}>
        <SearchMap results={filteredResults} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  fullSize: {
    ...StyleSheet.absoluteFillObject,
  },
});

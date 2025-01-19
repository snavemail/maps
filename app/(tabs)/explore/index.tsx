import { Pressable, View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import SearchMap from '~/components/Maps/SearchMap';
import SearchList from '~/components/SearchComponents/SearchList';
import { results } from '~/data/poi';
import { CATEGORIES, CATEGORY_NAMES, useCategoryStore } from '~/stores/useSearch';
import SearchMapLocationCard from '~/components/SearchComponents/SearchMapLocationCard';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { ScrollView } from 'react-native-gesture-handler';
import { useUserLocationStore } from '~/stores/useUserLocation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LucideIcon } from '~/components/LucideIcon';
import { useColorScheme } from 'nativewind';

export default function Explore() {
  const [view, setView] = useState<'map' | 'list'>('list');
  const userLocation = useUserLocationStore((state) => state.userLocation);
  const selectedResult = useCategoryStore((state) => state.selectedResult);

  const { categories, currentCategory, fetchCategoryResults } = useCategoryStore();
  const currentResults = currentCategory ? (categories[currentCategory]?.results ?? []) : [];

  useEffect(() => {
    // Fetch initial category if we have user location
    if (userLocation && !currentCategory) {
      // fetchCategoryResults(
      //   CATEGORIES.restaurant,
      //   userLocation.lat,
      //   userLocation.lon
      // );
    }
  }, [userLocation]);

  const handleCategoryPress = async (categoryId: string) => {
    if (!userLocation) return;

    await fetchCategoryResults(categoryId, userLocation.lat, userLocation.lon);
  };

  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
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
  }, [selectedResult, view]);

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <View className="flex-1" style={StyleSheet.absoluteFillObject}>
        <View style={[styles.fullSize, { opacity: view === 'list' ? 1 : 0 }]}>
          <SearchList results={currentResults} />
        </View>
        <View style={[styles.fullSize, { opacity: view === 'map' ? 1 : 0 }]}>
          <SearchMap results={currentResults} />
        </View>
      </View>

      {/* Categories Bar - Will overlay on top */}
      <View
        style={{
          marginTop: insets.top,
          zIndex: 1,
        }}
        className="w-3/4 self-center bg-transparent px-4 py-2">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}>
          {Object.entries(CATEGORIES).map(([key, value]) => (
            <Pressable
              key={key}
              onPress={() => handleCategoryPress(value)}
              className={`rounded-lg border px-3 py-2 ${
                currentCategory === value
                  ? 'bg-primary dark:bg-primary-dark'
                  : 'bg-white dark:bg-gray-800'
              }`}>
              <Text
                className={`
                font-semibold 
                ${currentCategory === value ? 'text-white' : 'text-text dark:text-text-dark'}
              `}>
                {CATEGORY_NAMES[value]}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Floating Controls */}
      <View className="absolute bottom-8 right-8 z-50 flex-col items-end gap-y-4">
        <Animated.View style={animatedButtonStyle}>
          <Pressable onPress={() => setView((prev) => (prev === 'map' ? 'list' : 'map'))}>
            <View className="flex-row items-center justify-center gap-2 rounded-lg border-2 border-black bg-background px-3 py-2 shadow-2xl dark:border-white dark:bg-background-dark">
              <LucideIcon
                iconName={view === 'map' ? 'List' : 'MapPinned'}
                size={19}
                color={colorScheme === 'dark' ? '#f1f1f1' : '#000'}
              />
              <Text className="text-lg font-semibold text-text dark:text-text-dark">
                {view === 'map' ? 'List' : 'Map'}
              </Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  fullSize: {
    ...StyleSheet.absoluteFillObject,
  },
});

import { View, Text, Image, Pressable } from 'react-native';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { journeys } from '~/data/journeys';
import { useSharedValue } from 'react-native-reanimated';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

export default function MapBottomSheet() {
  const sheetRef = useRef<BottomSheet>(null);

  const [activeJourney, setActiveJourney] = useState(journeys[0]);

  const renderItem = useCallback(
    ({ item }: any) => (
      <View className="flex flex-row gap-2 px-2">
        <Image source={{ uri: item.image }} className="h-20 w-20 rounded-lg" />
        <View className="ml-2 flex flex-1 flex-col">
          <Text className="text-white">{item.title}</Text>
          <Text className="text-white">{item.description}</Text>
          <Text className="text-white">
            {item.coordinates.latitude}, {item.coordinates.longitude}
          </Text>
        </View>
      </View>
    ),
    []
  );

  const snapPoints = useMemo(() => ['3%', '33%'], []);
  const animatedPosition = useSharedValue(0);

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: animatedPosition.value - 800 }],
    };
  });

  return (
    <>
      <Animated.View style={[buttonAnimatedStyle]}>
        <Pressable>
          <Text className="text-3xl">Moving Button</Text>
        </Pressable>
      </Animated.View>
      <BottomSheet
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose={false}
        enableContentPanningGesture={false}
        animatedPosition={animatedPosition}
        index={1}
        backgroundStyle={{
          backgroundColor: 'rgba(32, 32, 32, 0.9)',
        }}>
        <BottomSheetFlatList
          data={activeJourney.locations}
          ListHeaderComponent={() => (
            <View className="flex flex-row">
              <Pressable
                onPress={() => {
                  setActiveJourney(journeys[0]);
                }}>
                <Text>Make journey 1 active</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setActiveJourney(journeys[1]);
                }}>
                <Text>Make journey 2 active</Text>
              </Pressable>
            </View>
          )}
          stickyHeaderIndices={[0]}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          contentContainerStyle={{ backgroundColor: 'transparent' }}
        />
      </BottomSheet>
    </>
  );
}

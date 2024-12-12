import { View, Text, Image, Pressable } from 'react-native';
import React, { RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { journeys } from '~/data/journeys';
import { runOnJS, useDerivedValue, useSharedValue } from 'react-native-reanimated';
import JourneyMapBottomSheetLocation from './JourneyMapBottomSheetLocation';
import JourneyMapBottomSheetHeader from './JourneyMapBottomSheetHeader';
import { Camera } from '@rnmapbox/maps';

export default function JourneyMapBottomSheet({
  journey,
  cameraRef,
}: {
  journey: any;
  cameraRef: RefObject<Camera>;
}) {
  const snapPoints = useMemo(() => [76, '33%'], []);
  const animatedPosition = useSharedValue(0);

  const renderItem = useCallback(
    ({ item }: any) => <JourneyMapBottomSheetLocation location={item} cameraRef={cameraRef} />,
    []
  );

  return (
    <>
      <BottomSheet
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose={false}
        enableContentPanningGesture={false}
        animatedPosition={animatedPosition}
        index={1}
        style={{
          marginHorizontal: 5,
        }}
        backgroundStyle={{
          backgroundColor: '#fff',
        }}>
        <BottomSheetFlatList
          ListHeaderComponent={() => (
            <JourneyMapBottomSheetHeader onAdd={() => console.log('Add')} />
          )}
          stickyHeaderIndices={[0]}
          data={journey.locations}
          keyExtractor={(i: any) => i.id}
          renderItem={renderItem}
          contentContainerStyle={{ backgroundColor: 'transparent', gap: 2, paddingBottom: 20 }}
          ItemSeparatorComponent={() => <View className="h-1 bg-gray-200" />}
        />
      </BottomSheet>
    </>
  );
}

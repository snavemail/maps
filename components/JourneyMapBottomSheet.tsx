import { Text, View } from 'react-native';
import React, { RefObject, useCallback, useMemo, useState } from 'react';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import JourneyMapBottomSheetLocation from '~/components/JourneyMapBottomSheetLocation';
import { Camera } from '@rnmapbox/maps';
import HandleComponent from './JourneyBottomSheetHandleComponent';

export default function JourneyMapBottomSheet({
  journey,
  cameraRef,
  journeyRef,
  setLocation,
}: {
  journey: JourneyWithProfile;
  cameraRef: RefObject<Camera>;
  journeyRef: RefObject<BottomSheet>;
  setLocation: (location: LocationInfo) => void;
}) {
  const snapPoints = useMemo(() => [44, '33%'], []);
  const [isExpanded, setIsExpanded] = useState(true);
  const handleSheetChanges = useCallback((index: number) => {
    setIsExpanded(index === 1);
  }, []);

  const toggleBottomSheet = () => {
    if (isExpanded) {
      journeyRef.current?.snapToIndex(0);
      setIsExpanded(false);
    } else {
      journeyRef.current?.snapToIndex(1);
      setIsExpanded(true);
    }
  };

  const renderItem = useCallback(
    ({ item }: { item: LocationInfo }) => (
      <JourneyMapBottomSheetLocation
        location={item}
        cameraRef={cameraRef}
        setLocation={(location: LocationInfo) => {
          setLocation(location);
        }}
      />
    ),
    []
  );

  const handleComponent = useCallback(() => {
    return <HandleComponent onPress={toggleBottomSheet} isExpanded={isExpanded} />;
  }, [isExpanded]);

  return (
    <>
      <BottomSheet
        ref={journeyRef}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enableDynamicSizing={false}
        enablePanDownToClose={false}
        enableContentPanningGesture={false}
        index={1}
        animateOnMount={false}
        handleComponent={handleComponent}
        backgroundStyle={{
          backgroundColor: '#fff',
        }}>
        <BottomSheetFlatList
          data={journey.locations}
          keyExtractor={(i: any) => i.id}
          ListHeaderComponent={() => (
            <View className="flex-row items-center justify-between px-4 pt-2">
              <Text className="text-lg font-bold">{journey.title}</Text>
            </View>
          )}
          renderItem={renderItem}
          contentContainerStyle={{ backgroundColor: 'transparent', gap: 2, paddingBottom: 20 }}
          ItemSeparatorComponent={() => <View className="h-1 bg-gray-200" />}
        />
      </BottomSheet>
    </>
  );
}

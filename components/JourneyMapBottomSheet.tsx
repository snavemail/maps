import { View } from 'react-native';
import React, { RefObject, useCallback, useMemo } from 'react';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import JourneyMapBottomSheetLocation from './JourneyMapBottomSheetLocation';
import JourneyMapBottomSheetHeader from './JourneyMapBottomSheetHeader';
import { Camera } from '@rnmapbox/maps';
import { useAuthStore } from '~/stores/useAuth';

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
  const snapPoints = useMemo(() => [76, '33%'], []);
  const profile = useAuthStore((state) => state.profile);
  const isOwner = useMemo(() => journey.user_id === profile?.id, [journey.user_id]);

  const renderItem = useCallback(
    ({ item }: any) => (
      <JourneyMapBottomSheetLocation
        location={item}
        cameraRef={cameraRef}
        setLocation={(location: any) => {
          setLocation(location);
        }}
      />
    ),
    []
  );

  return (
    <>
      <BottomSheet
        ref={journeyRef}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose={false}
        enableContentPanningGesture={false}
        index={1}
        style={{
          marginHorizontal: 5,
        }}
        backgroundStyle={{
          backgroundColor: '#fff',
        }}>
        <BottomSheetFlatList
          ListHeaderComponent={() => (
            <JourneyMapBottomSheetHeader
              onAdd={() => console.log('Add')}
              onSave={() => console.log('Save')}
              isOwner={isOwner}
            />
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

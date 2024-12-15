import React, { useCallback, useMemo } from 'react';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useJourneyStore } from '~/stores/useJourney';
import { useSharedValue } from 'react-native-reanimated';
import MainMapBottomSheetHeader from './MainMapBottomSheetHeader';
import MainMapBottomSheetFooter from './MainMapBottomSheetFooter';
import DraftLocationPreview from './DraftLocationPreview';

export default function MapBottomSheet({
  showModal,
}: {
  showModal: (locationID?: string) => void;
}) {
  const draftJourney = useJourneyStore((state) => state.draftJourney);
  const locations = draftJourney?.locations || [];

  const animatedPosition = useSharedValue(0);

  const BOTTOM_SHEET_SNAP_POINTS = {
    COLLAPSED: '10%',
    MIDDLE: '33%',
    EXPANDED: '75%',
  } as const;

  const renderItem = useCallback(
    ({ item }: { item: DraftLocation }) => (
      <DraftLocationPreview draftLocation={item} showModal={showModal} />
    ),
    []
  );

  const snapPoints = useMemo(
    () => [
      BOTTOM_SHEET_SNAP_POINTS.COLLAPSED,
      BOTTOM_SHEET_SNAP_POINTS.MIDDLE,
      BOTTOM_SHEET_SNAP_POINTS.EXPANDED,
    ],
    []
  );

  return (
    <>
      {draftJourney && (
        <BottomSheet
          snapPoints={snapPoints}
          enableDynamicSizing={false}
          enablePanDownToClose={false}
          enableContentPanningGesture={false}
          animatedPosition={animatedPosition}
          index={1}
          backgroundStyle={{
            backgroundColor: '#fff',
          }}>
          <BottomSheetFlatList
            data={locations}
            stickyHeaderIndices={[0]}
            keyExtractor={(i) => i.id}
            renderItem={renderItem}
            ListHeaderComponent={
              <MainMapBottomSheetHeader journey={draftJourney} onPress={showModal} />
            }
            ListFooterComponent={<MainMapBottomSheetFooter />}
            contentContainerStyle={{ backgroundColor: 'transparent', gap: 8 }}
          />
        </BottomSheet>
      )}
    </>
  );
}

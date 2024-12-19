import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList } from 'react-native';
import DraftLocationPreview from './DraftLocationPreview';
import { useJourneyStore } from '~/stores/useJourney';
import { Camera } from '@rnmapbox/maps';
import { set } from 'lodash';

const DraftJourneyTimeline = ({ cameraRef }: { cameraRef: React.RefObject<Camera> }) => {
  const draftJourney = useJourneyStore((state) => state.draftJourney);
  const locations = draftJourney?.locations || [];
  const currentlyViewedJourney = useJourneyStore((state) => state.currentlyViewedJourney);
  const setCurrentViewedLocation = useJourneyStore((state) => state.setCurrentViewedLocation);
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { width } = Dimensions.get('window');

  const CARD_WIDTH = width * 0.9;
  const SPACER = (width - CARD_WIDTH) / 2;
  const GAP = SPACER / 2;

  const renderItem = useCallback(
    ({ item, index }: { item: DraftLocation; index: number }) => (
      <DraftLocationPreview
        draftLocation={item}
        cardWidth={CARD_WIDTH}
        index={index}
        cameraRef={cameraRef}
      />
    ),
    []
  );

  const handleMomentumScrollEnd = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (CARD_WIDTH + GAP));
    setCurrentIndex(index);
    const viewedLocation = locations[index];
    if (viewedLocation) {
      setCurrentViewedLocation(viewedLocation);
    }
  };

  const scrollToLocation = (id: string) => {
    const index = locations.findIndex((location) => location.id === id);
    setCurrentIndex(index);
    if (index !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index,
        animated: true,
      });
    }
  };

  useEffect(() => {
    if (currentlyViewedJourney) {
      scrollToLocation(currentlyViewedJourney.id);
    } else {
      if (currentIndex >= locations.length - 1) {
        const newIndex = locations.length - 1;
        setCurrentIndex(newIndex);
        setCurrentViewedLocation(locations[newIndex]);
        if (flatListRef.current) {
          flatListRef.current.scrollToIndex({
            index: newIndex,
            animated: true,
          });
        }
      }
    }
  }, [currentlyViewedJourney]);

  return (
    <FlatList
      ref={flatListRef}
      className="absolute bottom-8 w-full"
      horizontal
      getItemLayout={(_, index) => ({
        length: CARD_WIDTH,
        offset: (CARD_WIDTH + GAP) * index,
        index,
      })}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        columnGap: GAP,
        paddingLeft: SPACER,
        paddingRight: SPACER,
        alignItems: 'center',
      }}
      scrollEventThrottle={16}
      onMomentumScrollEnd={handleMomentumScrollEnd}
      snapToInterval={CARD_WIDTH + GAP}
      decelerationRate="fast"
      snapToAlignment="start"
      data={locations}
      renderItem={({ item, index }) => renderItem({ item, index })}
    />
  );
};

export default DraftJourneyTimeline;

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Pressable, View, Text, Alert } from 'react-native';
import DraftLocationPreview from './DraftLocationPreview';
import { useJourneyStore } from '~/stores/useJourney';
import { Camera } from '@rnmapbox/maps';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

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

  const router = useRouter();

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
    <View className="absolute bottom-4 flex flex-col items-center justify-center">
      <View
        style={{
          width: CARD_WIDTH,
          marginBottom: 10,
          backgroundColor: 'transparent',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          paddingHorizontal: 10,
        }}>
        <Text className="self-center text-2xl font-bold text-white">{draftJourney?.title}</Text>
      </View>
      <FlatList
        ref={flatListRef}
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
      <View
        style={{
          width: CARD_WIDTH,
          backgroundColor: 'transparent',
          display: 'flex',
          marginTop: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 10,
        }}>
        <Pressable
          disabled={!draftJourney}
          hitSlop={10}
          className="flex-1 active:scale-95"
          onPress={() => {
            router.push('/(tabs)/map/publish');
          }}>
          <View className="flex flex-row items-center justify-center gap-2 rounded-lg border-2 border-white bg-transparent px-3 py-2">
            <Text className="text-md font-semibold text-white">Finish</Text>
          </View>
        </Pressable>
        <Pressable
          disabled={!draftJourney}
          hitSlop={10}
          className="flex-1 active:scale-95"
          onPress={() => {
            router.push({
              pathname: '/addLocation/[slug]',
              params: { slug: '' },
            });
          }}>
          <View className="flex flex-row items-center justify-center gap-2 rounded-lg border-2 border-white bg-transparent px-3 py-2">
            <Text className="text-md font-semibold text-white">Add Location</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export default DraftJourneyTimeline;

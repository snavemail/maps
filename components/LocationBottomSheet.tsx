import { View, Text, Pressable, ScrollView } from 'react-native';
import React, { forwardRef, RefObject, useCallback, useState } from 'react';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import LocationMap from './Maps/LocationMap';
import { ChevronDown, Star, X } from 'lucide-react-native';
import { ChevronUp } from 'lucide-react-native';
import SignedImage from './Journey/SignedImage';

type LocationBottomSheetProps = {
  location: LocationInfo | null;
  journeyRef: RefObject<BottomSheet>;
};

const LocationHandleComponent = ({
  onPress,
  isExpanded,
  onClose,
}: {
  onPress: () => void;
  isExpanded: boolean;
  onClose: () => void;
}) => (
  <View className="h-12 w-full flex-row items-center gap-2 bg-white p-2">
    <Pressable
      onPress={onPress}
      className="flex flex-1 items-center justify-center rounded-lg bg-gray-100 p-1">
      <View className="flex-row items-center justify-center gap-2">
        {isExpanded ? (
          <>
            <ChevronDown size={20} color="black" />
            <Text className="text-md font-bold text-black">Collapse</Text>
          </>
        ) : (
          <>
            <ChevronUp size={20} color="black" />
            <Text className="text-md font-bold text-black">Expand</Text>
          </>
        )}
      </View>
    </Pressable>
    <Pressable
      onPress={onClose}
      className="flex items-center justify-center rounded-lg bg-gray-100 px-3 py-1">
      <X size={20} color="black" />
    </Pressable>
  </View>
);

const LocationBottomSheet = forwardRef<BottomSheet, LocationBottomSheetProps>(
  ({ location, journeyRef }, ref) => {
    const snapPoints = [40, '75%'];
    const [isExpanded, setIsExpanded] = useState(true);

    const handleClose = () => {
      journeyRef.current?.expand();
      if (ref && 'current' in ref) {
        ref.current?.close();
      }
    };

    const toggleExpand = () => {
      if (isExpanded && ref && 'current' in ref) {
        ref.current?.snapToIndex(0);
        setIsExpanded(false);
      } else if (ref && 'current' in ref) {
        ref.current?.snapToIndex(1);
        setIsExpanded(true);
      }
    };

    const handleComponent = useCallback(() => {
      return (
        <LocationHandleComponent
          onPress={toggleExpand}
          isExpanded={isExpanded}
          onClose={handleClose}
        />
      );
    }, [isExpanded]);

    if (!location) return null;

    return (
      <BottomSheet
        ref={ref}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose={false}
        enableContentPanningGesture={false}
        index={1}
        handleComponent={handleComponent}
        onChange={(index) => setIsExpanded(index === 1)}
        backgroundStyle={{
          backgroundColor: '#fff',
        }}>
        <BottomSheetScrollView>
          <View className="h-48">
            <LocationMap location={location} />
          </View>

          <View className="p-4">
            {/* Title and Rating */}
            <View className="mb-4">
              <Text className="text-xl font-bold text-gray-900">{location.title}</Text>
              {location.rating && (
                <View className="mt-1 flex-row items-center">
                  {[...Array(3)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      color="#FFD700"
                      fill={i < location.rating! ? '#FFD700' : 'none'}
                    />
                  ))}
                  <Text className="ml-2 text-sm text-gray-600">{location.rating}/3</Text>
                </View>
              )}
            </View>

            {/* Date and Address */}
            <View className="mb-4 space-y-2">
              <Text className="text-sm text-gray-600">
                {new Date(location.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
              <Text className="text-sm text-gray-600">
                {location.address ||
                  `${location.coordinates.latitude}, ${location.coordinates.longitude}`}
              </Text>
            </View>
            {location.description && (
              <Text className="mb-4 text-base text-gray-700">{location.description}</Text>
            )}
            {location.images && location.images.length > 0 && (
              <View>
                <Text className="mb-2 text-lg font-semibold text-gray-900">Photos</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    gap: 8,
                  }}>
                  {location.images.map((image, index) => (
                    <View key={index} className="relative h-48 w-48 overflow-hidden rounded-lg">
                      <SignedImage imagePath={image} />
                      <View className="absolute bottom-1 right-1 rounded-full bg-black/50 px-2 py-0.5">
                        <Text className="text-xs text-white">
                          {index + 1}/{location.images!.length}
                        </Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    );
  }
);
LocationBottomSheet.displayName = 'LocationBottomSheet';
export default LocationBottomSheet;

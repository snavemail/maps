import { View, Text, Pressable, ScrollView, Image } from 'react-native';
import React, { forwardRef, RefObject } from 'react';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { FontAwesome } from '@expo/vector-icons';
import LocationMap from './LocationMap';

type LocationBottomSheetProps = {
  location: any;
  journeyRef: RefObject<BottomSheet>;
};

const LocationBottomSheet = forwardRef<BottomSheet, LocationBottomSheetProps>(
  ({ location, journeyRef }, ref) => {
    const snapPoints = [76, '80%'];
    const renderStars = (rating: number) => {
      return (
        <View className="flex-row">
          {[1, 2, 3, 4, 5].map((star) => (
            <FontAwesome
              key={star}
              name={star < rating ? 'star' : 'star-o'}
              size={16}
              color={star < rating ? '#FFD700' : '#BDC3C7'}
              style={{ marginRight: 2 }}
            />
          ))}
        </View>
      );
    };

    return (
      <>
        <BottomSheet
          ref={ref}
          snapPoints={snapPoints}
          enableDynamicSizing={false}
          enablePanDownToClose={false}
          enableContentPanningGesture={false}
          style={{
            marginHorizontal: 0,
          }}
          backgroundStyle={{
            backgroundColor: '#fff',
          }}
          index={-1}>
          {location && (
            <BottomSheetScrollView className={'flex-1'}>
              <View className="h-64 w-full">
                <LocationMap location={location} />
              </View>
              <Pressable
                className="absolute right-4 top-4 z-10"
                onPress={() => {
                  journeyRef.current?.expand();
                  if (ref && 'current' in ref) {
                    ref.current?.close();
                  }
                }}>
                <View className="">
                  <FontAwesome name="close" size={30} color="white" />
                </View>
              </Pressable>
              <View className="px-4 py-4">
                {/* Header Section */}
                <View className="mb-4 flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-2xl font-bold text-gray-800">{location.title}</Text>
                    <View className="mt-1 flex-row items-center">
                      {renderStars(location.rating || 5)}
                      <Text className="ml-2 text-gray-600">{location.rating || 4}/5</Text>
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View className="flex-row gap-3">
                    <Pressable
                      className="bg-white p-2 active:scale-95"
                      style={({ pressed }) => (pressed ? { opacity: 0.7 } : {})}>
                      <FontAwesome name="edit" size={20} color={'black'} />
                    </Pressable>
                    <Pressable
                      className=" bg-white p-2 active:scale-95"
                      style={({ pressed }) => (pressed ? { opacity: 0.7 } : {})}>
                      <FontAwesome name="trash" size={20} color="black" />
                    </Pressable>
                    <Pressable
                      className="bg-white p-2 active:scale-95"
                      style={({ pressed }) => (pressed ? { opacity: 0.7 } : {})}>
                      <FontAwesome name="share" size={20} color="black" />
                    </Pressable>
                  </View>
                </View>

                {/* Date & Location */}
                <View className="mb-4">
                  <View className="mb-2 flex-row items-center">
                    <FontAwesome name="calendar" size={16} color="#666" />
                    <Text className="ml-2 text-gray-600">
                      {new Date(location.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <FontAwesome name="map-marker" size={16} color="#666" />
                    <Text className="ml-2 text-gray-600">
                      {location.address ||
                        `${location.coordinates.latitude}, ${location.coordinates.longitude}`}
                    </Text>
                  </View>
                </View>

                {/* Description */}
                <View className="mb-6">
                  <Text className="text-base leading-6 text-gray-700">{location.description}</Text>
                </View>

                {/* Image Gallery */}
                <View>
                  <Text className="mb-3 text-lg font-semibold text-gray-800">Gallery</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 3 }}
                    className="flex-row gap-3">
                    {location.images.map((image: any, index: number) => (
                      <Pressable
                        key={index}
                        className="relative"
                        onPress={() => console.log('image')}>
                        <Image source={{ uri: image }} className="h-32 w-32 rounded-lg" />
                        <View className="absolute bottom-2 right-2 rounded bg-black/50 px-2 py-1">
                          <Text className="text-xs text-white">
                            {index + 1}/{location.images.length}
                          </Text>
                        </View>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </BottomSheetScrollView>
          )}
        </BottomSheet>
      </>
    );
  }
);
LocationBottomSheet.displayName = 'LocationBottomSheet';
export default LocationBottomSheet;

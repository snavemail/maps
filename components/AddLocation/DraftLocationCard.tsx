import { View, Text, Pressable, Image, FlatList, Modal, Dimensions } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  MapPin,
  Clock11,
  Star,
  Image as SingleImage,
  Images,
  Locate,
  X,
  Pencil,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { generateTime } from '~/lib/utils';
import { Camera as MapCamera } from '@rnmapbox/maps';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useColorScheme } from 'nativewind';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const PHOTO_SIZE = (width - 48) / 3;

export default function DraftLocationCard({
  draftLocation,
  cardWidth,
  index,
  cameraRef,
}: {
  draftLocation: DraftLocation;
  cardWidth: number;
  index: number;
  cameraRef: React.RefObject<MapCamera>;
}) {
  const router = useRouter();
  const [showGallery, setShowGallery] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { colorScheme } = useColorScheme();
  const scale = useSharedValue(1);
  const startScale = useSharedValue(0);

  const ImageViewer = () => {
    const insets = useSafeAreaInsets();
    const [currentIndex, setCurrentIndex] = useState(selectedImageIndex);

    const goToNext = () => {
      setCurrentIndex((currentIndex + 1) % draftLocation.images.length);
    };
    const goToPrevious = () => {
      setCurrentIndex(
        (currentIndex - 1 + draftLocation.images.length) % draftLocation.images.length
      );
    };

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const pinch = Gesture.Pinch()
      .onStart(() => {
        startScale.value = scale.value;
      })
      .onUpdate((event) => {
        scale.value = Math.min(Math.max(startScale.value * event.scale, 1), 5);
      })
      .onEnd(() => {
        scale.value = withTiming(1);
      });

    return (
      <Modal
        visible={showImageViewer}
        transparent
        style={{
          marginVertical: 20,
        }}
        animationType="fade"
        onRequestClose={() => setShowImageViewer(false)}>
        <View
          className="flex-1 bg-background dark:bg-background-dark"
          style={{
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          }}>
          <View className="flex-row items-center justify-between p-4">
            <Text className="text-text dark:text-text-dark">
              {currentIndex + 1} of {draftLocation.images.length}
            </Text>
            <View className="flex-row items-center gap-x-4">
              <Pressable
                className="rounded-full bg-gray-800/50 p-2 active:scale-95"
                onPress={() => setShowImageViewer(false)}>
                <X size={24} color={colorScheme === 'dark' ? '#f1f1f1' : '#000'} />
              </Pressable>
            </View>
          </View>
          <GestureHandlerRootView className="flex-1">
            <GestureDetector gesture={pinch}>
              {draftLocation.images.length > 0 && (
                <Animated.Image
                  source={{ uri: draftLocation.images[currentIndex].uri }}
                  className="h-full w-full"
                  resizeMode="contain"
                  style={animatedStyle}
                />
              )}
            </GestureDetector>
          </GestureHandlerRootView>
          <View className="absolute inset-x-0 inset-y-0 flex-row items-center justify-between px-4">
            {draftLocation.images.length > 1 && (
              <View className="absolute inset-x-0 flex-row items-center justify-between px-4">
                <Pressable
                  className="rounded-full bg-gray-800/50 p-3"
                  onPress={() => goToPrevious()}>
                  <ChevronLeft size={24} color="white" />
                </Pressable>

                <Pressable className="ml-auto rounded-full bg-gray-800/50 p-3" onPress={goToNext}>
                  <ChevronRight size={24} color="white" />
                </Pressable>
              </View>
            )}
          </View>

          <View className="h-20 border-t border-gray-800">
            <FlatList
              data={draftLocation.images}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ padding: 8, gap: 8 }}
              renderItem={({ item: imageUri, index }) => (
                <Pressable
                  onPress={() => setCurrentIndex(index)}
                  className={`flex h-16 w-16 items-center justify-center overflow-hidden rounded-md ${
                    currentIndex === index ? 'border-2 border-white' : 'border-2 border-transparent'
                  }`}>
                  <Image
                    source={{ uri: imageUri.uri }}
                    style={{ width: 64, height: 64 }}
                    resizeMode="cover"
                  />
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <>
      <Pressable
        onPress={() => {
          router.push({
            pathname: '/form/[slug]',
            params: { slug: draftLocation.id },
          });
        }}
        style={{
          width: cardWidth,
          backgroundColor: colorScheme === 'dark' ? '#1f1f1f' : '#FFF',
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 3,
          overflow: 'hidden',
        }}
        className="rounded-lg">
        <View className="bg-background px-5 py-3 dark:bg-background-dark">
          <View className="mb-[2px] flex-1 bg-background dark:bg-background-dark">
            <Text className="text-lg font-semibold text-text dark:text-text-dark" numberOfLines={1}>
              {draftLocation.title}
            </Text>
          </View>

          <View className="flex-col bg-background dark:bg-background-dark">
            <View className="flex-row items-center">
              <MapPin size={12} color={colorScheme === 'dark' ? '#ccc' : '#444'} />
              <Text
                className="ml-1.5 flex-1 text-sm text-gray-700 dark:text-gray-200"
                numberOfLines={1}>
                {draftLocation.address}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Clock11 size={12} color={colorScheme === 'dark' ? '#ccc' : '#444'} />
              <Text className="ml-1.5 text-sm text-gray-700 dark:text-gray-200" numberOfLines={1}>
                {generateTime(draftLocation.date)}
              </Text>
            </View>
            <View className="mt-1 flex-row items-center justify-between gap-x-3">
              <Text className="text-xs text-gray-700 dark:text-gray-200" numberOfLines={1}>
                Stop {index + 1}
              </Text>

              {draftLocation.images.length > 0 && (
                <View className="flex-row items-center">
                  {draftLocation.images.length === 1 ? (
                    <SingleImage size={12} color={colorScheme === 'dark' ? '#ccc' : '#444'} />
                  ) : (
                    <Images size={12} color={colorScheme === 'dark' ? '#ccc' : '#444'} />
                  )}
                  <Text className="ml-1 text-xs text-gray-700 dark:text-gray-200">
                    {draftLocation.images.length}
                  </Text>
                </View>
              )}
              {/* Stars */}
              <View className="flex-row items-center">
                {[...Array(3)].map((_, index) => (
                  <Star
                    key={index}
                    size={12}
                    fill={index < draftLocation.rating ? '#FFD700' : 'none'}
                    color={index < draftLocation.rating ? '#FFD700' : '#CCCCCC'}
                  />
                ))}
              </View>
            </View>
          </View>
          {/* Action Buttons */}
          <View className="mt-3 flex-row items-center justify-between gap-x-2 border-t border-gray-200 pt-3 dark:border-gray-700">
            <Pressable
              className="flex-1 flex-row items-center justify-center rounded-md bg-[#f4f4f4] px-2.5 py-1.5 active:bg-[#e2e2e2] dark:bg-[#3f3f3f] dark:active:bg-[#4f4f4f]"
              onPress={() => {
                cameraRef?.current?.flyTo(
                  [draftLocation.coordinates.longitude, draftLocation.coordinates.latitude],
                  500
                );
              }}>
              <Locate size={14} color={colorScheme === 'dark' ? '#f1f1f1' : '#000'} />
              <Text className="ml-1 text-sm font-medium text-text dark:text-text-dark">Locate</Text>
            </Pressable>
            {draftLocation.images.length > 0 && (
              <Pressable
                className="flex-1 flex-row items-center justify-center rounded-md bg-[#f4f4f4] px-2.5 py-1.5 active:bg-[#e2e2e2] dark:bg-[#3f3f3f] dark:active:bg-[#4f4f4f]"
                onPress={() => setShowGallery(true)}>
                {draftLocation.images.length > 1 ? (
                  <Images size={14} color={colorScheme === 'dark' ? '#f1f1f1' : '#000'} />
                ) : (
                  <SingleImage size={14} color={colorScheme === 'dark' ? '#f1f1f1' : '#000'} />
                )}
                <Text className="ml-1 text-sm text-text dark:text-text-dark">Photos</Text>
              </Pressable>
            )}
            <Pressable
              className="flex-1 flex-row items-center justify-center rounded-md bg-[#f4f4f4] px-2.5 py-1.5 active:bg-[#e2e2e2] dark:bg-[#3f3f3f] dark:active:bg-[#4f4f4f]"
              onPress={() => {
                router.push({
                  pathname: '/form/[slug]',
                  params: { slug: draftLocation.id },
                });
              }}>
              <Pencil size={14} color={colorScheme === 'dark' ? '#f1f1f1' : '#000'} />
              <Text className="ml-1 text-sm font-medium text-text dark:text-text-dark">Edit</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
      <Modal
        visible={showGallery}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowGallery(false)}>
        <View className="flex-1 bg-background dark:bg-background-dark">
          <View className="flex-row items-center justify-between bg-[#f1f1f1] p-4 dark:bg-[#1f1f1f]">
            <Text className="text-lg font-semibold text-text dark:text-text-dark">
              Photos from {draftLocation.title}
            </Text>
            <Pressable
              className="rounded-full p-2 active:scale-95"
              onPress={() => setShowGallery(false)}>
              <X size={24} color={colorScheme === 'dark' ? '#f1f1f1' : '#000'} />
            </Pressable>
          </View>
          <FlatList
            className="bg-background dark:bg-background-dark"
            data={draftLocation.images}
            numColumns={3}
            contentContainerStyle={{ padding: 16 }}
            columnWrapperStyle={{ gap: 8 }}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            renderItem={({ item: imageUri, index }) => (
              <Pressable
                onPress={() => {
                  setSelectedImageIndex(index);
                  setShowImageViewer(true);
                }}>
                <Image
                  source={{ uri: imageUri.uri }}
                  style={{
                    width: PHOTO_SIZE,
                    height: PHOTO_SIZE,
                    borderRadius: 8,
                  }}
                />
              </Pressable>
            )}
          />
        </View>
      </Modal>
      <ImageViewer />
    </>
  );
}

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
import Animated, {
  clamp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';

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

  const scale = useSharedValue(1);
  const startScale = useSharedValue(0);

  const ImageViewer = () => {
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

    // PINCH
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
        animationType="fade"
        onRequestClose={() => setShowImageViewer(false)}>
        <View className="flex-1 bg-black">
          <View className="flex-row items-center justify-between p-4">
            <Text className="text-white">
              {currentIndex + 1} of {draftLocation.images.length}
            </Text>
            <View className="flex-row items-center gap-x-4">
              <Pressable
                className="rounded-full bg-gray-800/50 p-2 active:scale-95"
                onPress={() => setShowImageViewer(false)}>
                <X size={24} color="white" />
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
          backgroundColor: '#FFF',
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 3,
          overflow: 'hidden',
        }}
        className="rounded-lg">
        <View className="px-5 py-3">
          <View className="mb-[2px] flex-1">
            <Text className="text-lg font-semibold text-gray-900" numberOfLines={1}>
              {draftLocation.title}
            </Text>
          </View>

          <View className="">
            <View className="flex-row items-center">
              <MapPin size={12} color="#666666" />
              <Text className="ml-1.5 flex-1 text-sm text-gray-600" numberOfLines={1}>
                {draftLocation.address}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Clock11 size={12} color="#666666" />
              <Text className="ml-1.5 text-sm text-gray-600" numberOfLines={1}>
                {generateTime(draftLocation.date)}
              </Text>
            </View>
            <View className="mt-1 flex-row items-center gap-x-3">
              <Text className="text-xs text-gray-500" numberOfLines={1}>
                Stop {index + 1}
              </Text>
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
              {draftLocation.images.length > 0 && (
                <View className="flex-row items-center">
                  {draftLocation.images.length === 1 ? (
                    <SingleImage size={12} color="#666666" />
                  ) : (
                    <Images size={12} color="#666666" />
                  )}
                  <Text className="ml-1 text-xs text-gray-500">{draftLocation.images.length}</Text>
                </View>
              )}
            </View>
          </View>
          {/* Action Buttons */}
          <View className="mt-3 flex-row items-center justify-between gap-x-2 border-t border-gray-100 pt-3">
            <Pressable
              className="flex-1 flex-row items-center justify-center rounded-md bg-gray-100 px-2.5 py-1.5 active:bg-gray-200"
              onPress={() => {
                cameraRef?.current?.flyTo(
                  [draftLocation.coordinates.longitude, draftLocation.coordinates.latitude],
                  500
                );
              }}>
              <Locate size={14} color="#374151" />
              <Text className="ml-1 text-sm font-medium text-gray-700">Fly To</Text>
            </Pressable>
            {draftLocation.images.length > 0 && (
              <Pressable
                className="flex-1 flex-row items-center justify-center rounded-md bg-gray-100 px-2.5 py-1.5 active:bg-gray-200"
                onPress={() => setShowGallery(true)}>
                {draftLocation.images.length > 1 ? (
                  <Images size={14} color="#374151" />
                ) : (
                  <SingleImage size={14} color="#374151" />
                )}
                <Text className="ml-1 text-sm text-gray-600">Photos</Text>
              </Pressable>
            )}
            <Pressable
              className="flex-1 flex-row items-center justify-center rounded-md bg-gray-100 px-2.5 py-1.5 active:bg-gray-200"
              onPress={() => {
                router.push({
                  pathname: '/form/[slug]',
                  params: { slug: draftLocation.id },
                });
              }}>
              <Pencil size={14} color="#374151" />
              <Text className="ml-1 text-sm font-medium text-gray-700">Edit</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
      <Modal
        visible={showGallery}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowGallery(false)}>
        <View className="flex-1 bg-white">
          <View className="flex-row items-center justify-between border-b border-gray-200 p-4">
            <Text className="text-lg font-semibold">Photos from {draftLocation.title}</Text>
            <Pressable
              className="rounded-full p-2 active:scale-95"
              onPress={() => setShowGallery(false)}>
              <X size={24} color="#374151" />
            </Pressable>
          </View>
          <FlatList
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

import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  ScrollView,
  Image,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import 'react-native-get-random-values';
import * as Location from 'expo-location';
import { useJourneyStore } from '~/stores/useJourney';
import { FontAwesome } from '@expo/vector-icons';
import { getTitle } from '~/lib/utils';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AddLocationModalProps {
  visible: boolean;
  onClose: () => void;
  locationID?: string;
}

export default function AddLocationForm({ visible, onClose, locationID }: AddLocationModalProps) {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [address, setAddress] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickingImages, setPickingImages] = useState(false);
  const MAX_IMAGES = 5;

  const getLocation = useJourneyStore((state) => state.getLocation);
  const addLocation = useJourneyStore((state) => state.addLocation);
  const updateLocation = useJourneyStore((state) => state.updateLocation);
  const removeLocation = useJourneyStore((state) => state.removeLocation);

  const [form, setForm] = useState<{
    isUpdate: boolean;
    title: string;
    description: string;
    date: Date;
    images: ImageItem[];
    rating: number;
    hideLocation: boolean;
    hideTime: boolean;
  }>({
    isUpdate: locationID ? true : false,
    title: '',
    description: '',
    date: new Date(),
    images: [],
    rating: 5,
    hideLocation: false,
    hideTime: false,
  });

  useEffect(() => {
    if (visible && locationID) {
      const existingLocation = getLocation(locationID);
      if (existingLocation) {
        setForm({
          isUpdate: true,
          title: existingLocation.title,
          description: existingLocation.description || '',
          date: new Date(existingLocation.date),
          images: existingLocation.images.map((uri) => ({ uri })),
          rating: existingLocation.rating,
          hideLocation: existingLocation.hideLocation,
          hideTime: existingLocation.hideTime,
        });
        setLocation({
          coords: {
            latitude: existingLocation.coordinates.latitude,
            longitude: existingLocation.coordinates.longitude,
          },
        } as Location.LocationObject);
        setAddress(existingLocation.address || '');
      }
    } else if (visible) {
      getCurrentLocation();
      setForm({
        isUpdate: false,
        title: '',
        description: '',
        date: new Date(),
        images: [],
        rating: 5,
        hideLocation: false,
        hideTime: false,
      });
    }
  }, [visible, locationID]);

  const processImage = async (uri: string): Promise<string> => {
    const result = await (
      await ImageManipulator.ImageManipulator.manipulate(uri).resize({ width: 1080 }).renderAsync()
    ).saveAsync({
      compress: 0.8,
      format: ImageManipulator.SaveFormat.JPEG,
    });

    return result.uri;
  };

  const pickImages = async () => {
    if (form.images.length >= MAX_IMAGES) {
      alert(`You can only select up to ${MAX_IMAGES} images`);
      return;
    }

    setPickingImages(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        quality: 1,
        selectionLimit: MAX_IMAGES - form.images.length,
      });

      if (!result.canceled) {
        const newImageItems: ImageItem[] = result.assets.map((asset) => ({
          uri: asset.uri,
          loading: true,
        }));

        setForm((prev) => ({
          ...prev,
          images: [...prev.images, ...newImageItems],
        }));

        const processedImages = await Promise.all(
          result.assets.map(async (asset) => {
            try {
              const processedUri = await processImage(asset.uri);
              return { uri: processedUri };
            } catch (error) {
              console.error('Error processing image:', error);
              return { uri: asset.uri, error: true };
            }
          })
        );

        setForm((prev) => {
          const oldImages = prev.images.slice(0, prev.images.length - result.assets.length);
          const newProcessedImages = processedImages.map((img) => ({
            ...img,
            loading: false,
          }));
          return {
            ...prev,
            images: [...oldImages, ...newProcessedImages],
          };
        });
      }
    } catch (error) {
      console.error('Error picking the images:', error);
      alert('Error selecting images');
    } finally {
      setPickingImages(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleConfirm = (date: Date) => {
    setForm((prev) => ({ ...prev, date }));
    setShowDatePicker(false);
  };

  useEffect(() => {
    if (visible && !updateLocation) {
      getCurrentLocation();
    }
  }, [visible]);

  const getCurrentLocation = async () => {
    console.log('Getting current location');
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(currentLocation);

      const [addressResult] = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (addressResult) {
        const fullAddress = [
          addressResult.street,
          addressResult.city,
          addressResult.region,
          addressResult.country,
        ]
          .filter(Boolean)
          .join(', ');

        setAddress(fullAddress);
        setForm((prev) => ({
          ...prev,
          title: getTitle({ isJourney: false, address: addressResult }),
        }));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error getting location');
    } finally {
      setLoading(false);
    }
  };

  const onCloseModal = () => {
    setForm({
      isUpdate: true,
      title: '',
      description: '',
      date: new Date(),
      images: [],
      rating: 5,
      hideLocation: false,
      hideTime: false,
    });

    onClose();
  };

  const handleSubmit = () => {
    if (!location) return;

    const locationData = {
      title: form.title,
      description: form.description,
      date: form.date.toISOString(),
      coordinates: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
      address,
      images: form.images.map((image) => image.uri),
      rating: form.rating,
      hideLocation: form.hideLocation,
      hideTime: form.hideTime,
    };

    if (form.isUpdate && locationID) {
      updateLocation(locationID, locationData);
    } else {
      addLocation(locationData);
    }

    onCloseModal();
  };

  const handleRemoveLocation = (locationID: string) => {
    removeLocation(locationID);
    onCloseModal();
  };

  const RatingStars = () => {
    return (
      <View className="flex-row gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Pressable
            key={star}
            onPress={() => setForm((prev) => ({ ...prev, rating: star }))}
            hitSlop={8}>
            <FontAwesome
              name={star <= form.rating ? 'star' : 'star-o'}
              size={24}
              color={star <= form.rating ? '#FFD700' : '#CCCCCC'}
            />
          </Pressable>
        ))}
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onCloseModal}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-end">
        <View className="flex-1 justify-end ">
          <ScrollView
            bounces={false}
            stickyHeaderIndices={[0]}
            className="rounded-t-3xl bg-white pb-8"
            style={{
              maxHeight: '88%',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}>
            <View className="flex-row items-center justify-between border-b border-gray-200 bg-white p-4">
              <Text className="text-xl font-semibold">
                {form.isUpdate ? 'Update Location' : 'Add Location'}
              </Text>
              <Pressable onPress={onCloseModal} hitSlop={8} className="active:scale-95">
                <FontAwesome name="times" size={24} color="black" />
              </Pressable>
            </View>
            {loading ? (
              <View className="items-center p-8">
                <ActivityIndicator size="large" />
                <Text className="mt-4 text-gray-600">Getting your location...</Text>
              </View>
            ) : (
              <View className="p-4">
                {location && (
                  <View className="mb-4 rounded-lg bg-gray-100 p-4">
                    <Text className="text-sm text-gray-600">Current Location</Text>
                    <Text className="text-gray-900">{address}</Text>
                    <Text className="mt-1 text-xs text-gray-500">
                      lon: {location.coords.latitude.toFixed(6)}, lat:{' '}
                      {location.coords.longitude.toFixed(6)}
                    </Text>
                  </View>
                )}

                <View className="gap-y-2">
                  <View>
                    <Text className="mb-1 text-sm text-gray-600">Title</Text>
                    <TextInput
                      value={form.title}
                      onChangeText={(text) => setForm((prev) => ({ ...prev, title: text }))}
                      className="rounded-lg border border-gray-200 p-3"
                      placeholder="Enter a title"
                    />
                  </View>

                  <View>
                    <Text className="mb-1 text-sm text-gray-600">Description</Text>
                    <TextInput
                      value={form.description}
                      onChangeText={(text) => setForm((prev) => ({ ...prev, description: text }))}
                      className="rounded-lg border border-gray-200 p-3"
                      placeholder="Enter a description"
                      multiline
                      numberOfLines={3}
                    />
                  </View>

                  <View>
                    <Text className="mb-1 text-sm text-gray-600">Date & Time</Text>
                    <Pressable
                      onPress={() => setShowDatePicker(true)}
                      className="rounded-lg border border-gray-200 p-3">
                      <Text>{form.date.toLocaleString()}</Text>
                    </Pressable>

                    <DateTimePickerModal
                      isVisible={showDatePicker}
                      buttonTextColorIOS="#000"
                      mode="datetime"
                      onConfirm={handleConfirm}
                      onCancel={() => setShowDatePicker(false)}
                      date={form.date}
                      maximumDate={new Date()}
                    />
                  </View>

                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 10, paddingVertical: 8 }}
                    className="flex-row gap-2">
                    <Pressable
                      onPress={pickImages}
                      disabled={pickingImages || form.images.length >= MAX_IMAGES}
                      className={`h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed border-black active:border-gray-600`}>
                      <>
                        <FontAwesome
                          name="photo"
                          size={24}
                          color={form.images.length >= MAX_IMAGES ? 'lightgray' : 'black'}
                        />
                        <Text className="mt-1 text-xs text-black ">
                          {form.images.length}/{MAX_IMAGES}
                        </Text>
                      </>
                    </Pressable>

                    {form.images.map((image, index) => (
                      <View key={index} className="relative">
                        {image.loading ? (
                          <View className="h-24 w-24 items-center justify-center rounded-lg bg-gray-100">
                            <ActivityIndicator />
                          </View>
                        ) : (
                          <>
                            <Image source={{ uri: image.uri }} className="h-24 w-24 rounded-lg" />
                            {image.error && (
                              <View className="absolute inset-0 items-center justify-center rounded-lg bg-black/50">
                                <FontAwesome name="warning" size={20} color="white" />
                              </View>
                            )}
                            <Pressable
                              onPress={() => removeImage(index)}
                              className="absolute -right-2 -top-2 rounded-full bg-black p-1"
                              hitSlop={8}>
                              <FontAwesome name="times" size={12} color="white" />
                            </Pressable>
                          </>
                        )}
                      </View>
                    ))}
                  </ScrollView>
                </View>

                <View className="mb-4 flex flex-row">
                  <Text className="mb-2 flex-1 text-sm text-gray-600">Rating</Text>
                  <RatingStars />
                </View>

                <View className="mb-4 gap-y-2">
                  <View className="flex-row items-center justify-between">
                    <View>
                      <Text className="text-base font-medium">Hide Location</Text>
                      <Text className="text-sm text-gray-500">Keep this location private</Text>
                    </View>
                    <Switch
                      style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                      value={form.hideLocation}
                      onValueChange={(value) =>
                        setForm((prev) => ({ ...prev, hideLocation: value }))
                      }
                      trackColor={{ true: '#5f5f5f', false: '#767577' }}
                      thumbColor={form.hideLocation ? '#1f1f1f' : '#f4f3f4'}
                    />
                  </View>

                  <View className="flex-row items-center justify-between">
                    <View>
                      <Text className="text-base font-medium">Hide Time</Text>
                      <Text className="text-sm text-gray-500">Don't show when this happened</Text>
                    </View>
                    <Switch
                      style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                      value={form.hideTime}
                      onValueChange={(value) => setForm((prev) => ({ ...prev, hideTime: value }))}
                      trackColor={{ true: '#5f5f5f', false: '#767577' }}
                      thumbColor={form.hideTime ? '#1f1f1f' : '#f4f3f4'}
                    />
                  </View>
                </View>
                <View className="flex flex-col gap-4 py-2">
                  <Pressable
                    onPress={handleSubmit}
                    className="flex-1 items-center justify-center rounded-lg bg-black px-3 py-3 active:bg-[#1f1f1f]"
                    disabled={!location || !form.title}>
                    <Text className="text-center font-semibold text-white">
                      {form.isUpdate ? 'Update Location' : 'Add Location'}
                    </Text>
                  </Pressable>
                  {form.isUpdate && locationID && (
                    <Pressable
                      onPress={() => handleRemoveLocation(locationID)}
                      className="flex-1 items-center justify-center rounded-lg bg-red-500 px-3 py-3 active:bg-red-400"
                      disabled={!location || !form.title}>
                      <Text className="text-center font-semibold text-white">Remove Location</Text>
                    </Pressable>
                  )}
                  <Pressable onPress={onCloseModal} className="flex-1 items-center justify-center">
                    <Text className="text-center font-semibold text-black underline">Cancel</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

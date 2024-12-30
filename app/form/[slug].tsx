import {
  View,
  Text,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  Image,
  Switch,
  TextInput,
  Alert,
  SafeAreaView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { getTitle } from '~/lib/utils';
import { useJourneyStore } from '~/stores/useJourney';
import { useUserLocationStore } from '~/stores/useUserLocation';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as FileSystem from 'expo-file-system';
import { X } from 'lucide-react-native';
import { colorScheme, useColorScheme } from 'nativewind';

interface LocationData {
  isUpdate: boolean;
  title: string;
  description: string;
  date: Date;
  images: ImageItem[];
  rating: number;
  hideLocation: boolean;
  hideTime: boolean;
}

export default function AddLocationForm() {
  const { slug } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [address, setAddress] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickingImages, setPickingImages] = useState(false);
  const [addressResult, setAddressResult] = useState<Location.LocationGeocodedAddress | null>(null);
  const [form, setForm] = useState<LocationData>({
    isUpdate: slug ? true : false,
    title: '',
    description: '',
    date: new Date(),
    images: [],
    rating: 3,
    hideLocation: false,
    hideTime: false,
  });
  const router = useRouter();
  const { colorScheme } = useColorScheme();

  const setCurrentViewedLocation = useJourneyStore((state) => state.setCurrentViewedLocation);
  const getLocation = useJourneyStore((state) => state.getLocation);
  const addLocation = useJourneyStore((state) => state.addLocation);
  const updateLocation = useJourneyStore((state) => state.updateLocation);
  const removeLocation = useJourneyStore((state) => state.removeLocation);
  const startJourney = useJourneyStore((state) => state.startJourney);
  const endJourney = useJourneyStore((state) => state.endJourney);
  const draftJourney = useJourneyStore((state) => state.draftJourney);
  const userLocation = useUserLocationStore((state) => state.userLocation);

  useEffect(() => {
    if (slug) {
      const existingLocation = getLocation(slug as string);
      if (existingLocation) {
        setForm({
          isUpdate: true,
          title: existingLocation.title,
          description: existingLocation.description || '',
          date: new Date(existingLocation.date),
          images: existingLocation.images.map((image) => ({
            uri: image.uri,
            base64: image.base64,
          })),
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
    } else {
      setForm({
        isUpdate: false,
        title: '',
        description: '',
        date: new Date(),
        images: [],
        rating: 3,
        hideLocation: false,
        hideTime: false,
      });
      getCurrentLocation();
    }
  }, [slug]);

  const onRemove = (locationID: string) => {
    Alert.alert('Remove Location', 'Are you sure you want to remove this location?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      { text: 'Yes', onPress: () => handleRemoveLocation(locationID), style: 'destructive' },
    ]);
  };

  const processImage = async (uri: string): Promise<string> => {
    const image = await ImageManipulator.manipulate(uri).resize({ width: 1080 }).renderAsync();
    const result = await image.saveAsync({
      compress: 0.7,
      format: SaveFormat.JPEG,
    });

    return result.uri;
  };

  const pickImages = async () => {
    setPickingImages(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        quality: 1,
        base64: true,
      });

      if (!result.canceled) {
        const processedImages: ImageItem[] = await Promise.all(
          result.assets.map(async (asset) => {
            try {
              const processedUri = await processImage(asset.uri);
              const base64 = await FileSystem.readAsStringAsync(processedUri, {
                encoding: FileSystem.EncodingType.Base64,
              });
              return { uri: processedUri, base64 };
            } catch (error) {
              console.error('Error processing image:', error);
              return { uri: asset.uri, base64: asset.base64, error: true };
            }
          })
        );

        setForm((prev) => ({
          ...prev,
          images: [...prev.images, ...processedImages],
        }));
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

  const getCurrentLocation = async () => {
    setLoading(true);
    try {
      setLocation({
        coords: {
          latitude: userLocation?.lat!,
          longitude: userLocation?.lon!,
          altitude: 0,
          accuracy: 0,
          altitudeAccuracy: 0,
          heading: 0,
          speed: 0,
        },
        timestamp: new Date().getTime(),
      });

      const [addressResult] = await Location.reverseGeocodeAsync({
        latitude: userLocation?.lat!,
        longitude: userLocation?.lon!,
      });
      setAddressResult(addressResult);

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

  const onClose = () => {
    setForm({
      isUpdate: true,
      title: '',
      description: '',
      date: new Date(),
      images: [],
      rating: 3,
      hideLocation: false,
      hideTime: false,
    });
    router.back();
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
      images: form.images.map((image) => ({ uri: image.uri, base64: image.base64 })),
      rating: form.rating,
      hideLocation: form.hideLocation, // not used
      hideTime: form.hideTime, // not used
    };
    if (form.isUpdate && slug) {
      updateLocation(slug as string, {
        ...locationData,
        images: form.images,
      });
    } else {
      if (!draftJourney && addressResult) {
        startJourney(getTitle({ isJourney: true, address: addressResult }));
      } else if (!draftJourney) {
        startJourney('New Journey');
      }
      addLocation(locationData);
    }

    onClose();
  };

  const handleRemoveLocation = (locationID: string) => {
    removeLocation(locationID);
    setCurrentViewedLocation(null);
    if (draftJourney && draftJourney.locations.length === 1) {
      endJourney();
    }
    onClose();
  };

  const RatingStars = () => {
    return (
      <View className="flex-1 flex-row items-center gap-2">
        {[1, 2, 3].map((star) => (
          <Pressable
            key={star}
            onPress={() => setForm((prev) => ({ ...prev, rating: star }))}
            hitSlop={8}>
            <FontAwesome
              name={star <= form.rating ? 'star' : 'star-o'}
              size={60}
              color={star <= form.rating ? '#FFD700' : '#CCCCCC'}
            />
          </Pressable>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-end">
        <ScrollView
          bounces
          stickyHeaderIndices={[0]}
          className="bg-background pb-8 dark:bg-background-dark"
          contentContainerStyle={{ flexGrow: 1, minHeight: '100%' }}>
          <View className="flex-row items-center justify-between border-b border-gray-200 bg-background p-4 dark:border-gray-700 dark:bg-background-dark">
            <Text className="text-xl font-semibold text-text dark:text-text-dark">
              {form.isUpdate ? 'Update Location' : 'Add Location'}
            </Text>
            <Pressable hitSlop={8} className="rounded-full p-2 active:scale-95" onPress={onClose}>
              <X size={24} color={colorScheme === 'dark' ? '#f1f1f1' : '#000'} />
            </Pressable>
          </View>
          {loading ? (
            <View className="h-full items-center p-8">
              <ActivityIndicator size="large" />
              <Text className="mt-4 text-gray dark:text-gray-dark">Getting your location...</Text>
            </View>
          ) : (
            <View className="flex-1 p-4">
              {location && (
                <View className="mb-4 rounded-lg bg-gray-200 p-4 dark:bg-gray-700">
                  <Text className="text-sm text-gray dark:text-gray-dark">Current Location</Text>
                  <Text className="text-text dark:text-text-dark">{address}</Text>
                  <Text className="mt-1 text-xs text-gray-500 dark:text-gray-dark">
                    lon: {location.coords.latitude.toFixed(6)}, lat:{' '}
                    {location.coords.longitude.toFixed(6)}
                  </Text>
                </View>
              )}

              <View className="gap-y-2">
                <View>
                  <Text className="mb-1 text-sm text-gray dark:text-gray-dark ">Title</Text>
                  <TextInput
                    value={form.title}
                    onChangeText={(text) => setForm((prev) => ({ ...prev, title: text }))}
                    className="rounded-lg border border-gray-700 p-3 text-text dark:border-gray-200 dark:text-text-dark"
                    placeholder="Enter a title"
                    placeholderTextColor={colorScheme === 'dark' ? '#f2f2f2' : '#1f1f1f'}
                  />
                </View>

                <View>
                  <Text className="mb-1 text-sm text-gray dark:text-gray-dark ">Description</Text>
                  <TextInput
                    value={form.description}
                    onChangeText={(text) => setForm((prev) => ({ ...prev, description: text }))}
                    className="rounded-lg border border-gray-700 p-3 text-text dark:border-gray-200 dark:text-text-dark"
                    placeholder="Enter a description"
                    multiline
                    numberOfLines={3}
                    placeholderTextColor={colorScheme === 'dark' ? '#f2f2f2' : '#1f1f1f'}
                  />
                </View>

                <View>
                  <Text className="mb-1 text-sm text-gray dark:text-gray-dark ">Date & Time</Text>
                  <Pressable
                    onPress={() => setShowDatePicker(true)}
                    className="rounded-lg border border-gray-700 p-3 text-text dark:border-gray-200 dark:text-text-dark">
                    <Text className="text-text dark:text-text-dark">
                      {form.date.toLocaleString()}
                    </Text>
                  </Pressable>

                  <DateTimePickerModal
                    isVisible={showDatePicker}
                    mode="datetime"
                    onConfirm={handleConfirm}
                    onCancel={() => setShowDatePicker(false)}
                    date={form.date}
                    maximumDate={new Date()}
                    buttonTextColorIOS={colorScheme === 'dark' ? '#f1f1f1' : '#000'}
                    textColor={colorScheme === 'dark' ? '#f1f1f1' : '#000'}
                    themeVariant={colorScheme === 'dark' ? 'dark' : 'light'}
                    isDarkModeEnabled={colorScheme === 'dark'}
                    display="spinner"
                  />
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 10, paddingVertical: 8 }}
                  className="flex-row gap-2">
                  <Pressable
                    onPress={pickImages}
                    disabled={pickingImages}
                    className={`h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed border-black active:scale-95 dark:border-white`}>
                    <FontAwesome
                      name="photo"
                      size={24}
                      color={colorScheme === 'dark' ? '#fff' : '#000'}
                      style={{ opacity: pickingImages ? 0.5 : 1 }}
                    />
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
                            <X size={12} color="white" />
                          </Pressable>
                        </>
                      )}
                    </View>
                  ))}
                </ScrollView>
              </View>

              <View className="mb-4 mt-2 flex-1 flex-row items-center justify-between">
                <Text className="text-md flex-1 text-gray dark:text-gray-dark">Rating</Text>
                <RatingStars />
              </View>

              {/* <View className="mb-4 gap-y-2">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="font-medium text-text dark:text-text-dark">Hide Location</Text>
                    <Text className="text-sm text-gray dark:text-gray-dark">
                      Keep this location private
                    </Text>
                  </View>
                  <Switch
                    style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                    value={form.hideLocation}
                    onValueChange={(value) => setForm((prev) => ({ ...prev, hideLocation: value }))}
                    trackColor={{ true: '#60A5FA', false: '#767577' }}
                    thumbColor={form.hideLocation ? '#0f58a0' : '#f4f3f4'}
                  />
                </View>

                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="font-medium text-text dark:text-text-dark">Hide Time</Text>
                    <Text className="text-sm text-gray dark:text-gray-dark">
                      Don't show when this happened
                    </Text>
                  </View>
                  <Switch
                    style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                    value={form.hideTime}
                    onValueChange={(value) => setForm((prev) => ({ ...prev, hideTime: value }))}
                    trackColor={{ true: '#60A5FA', false: '#767577' }}
                    thumbColor={form.hideTime ? '#0f58a0' : '#f4f3f4'}
                  />
                </View>
              </View> */}
              <View className="flex-1" />
              <View className="mt-auto gap-4 py-2">
                <Pressable
                  onPress={handleSubmit}
                  className="flex-1 items-center justify-center rounded-lg  bg-primary px-3 py-3 active:bg-primary/80 dark:border-primary-dark dark:bg-primary-dark dark:active:bg-primary-dark/80"
                  disabled={!location || !form.title || pickingImages}>
                  <Text className="text-center font-semibold text-white">
                    {form.isUpdate ? 'Update Location' : 'Add Location'}
                  </Text>
                </Pressable>
                {form.isUpdate && slug && (
                  <Pressable
                    onPress={() => {
                      onRemove(slug as string);
                    }}
                    className="flex-1 items-center justify-center rounded-lg border-2 border-danger bg-transparent py-2">
                    <Text className="text-center font-semibold text-danger">
                      {'Remove Location'}
                    </Text>
                  </Pressable>
                )}
                <Pressable onPress={onClose} className="flex-1 items-center justify-center">
                  <Text className="text-center font-semibold text-text underline dark:text-text-dark">
                    Cancel
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

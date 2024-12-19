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
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { ImageManipulator } from 'expo-image-manipulator';
import { getTitle } from '~/lib/utils';
import { useJourneyStore } from '~/stores/useJourney';
import { useUserLocationStore } from '~/stores/useUserLocation';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

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
    rating: 5,
    hideLocation: false,
    hideTime: false,
  });
  const router = useRouter();
  const MAX_IMAGES = 5;

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
    } else {
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
      rating: 5,
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
      images: form.images.map((image) => image.uri),
      rating: form.rating,
      hideLocation: form.hideLocation,
      hideTime: form.hideTime,
    };

    if (form.isUpdate && slug) {
      updateLocation(slug as string, locationData);
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 justify-end">
      <View className="flex-1 justify-end">
        <ScrollView
          bounces={true}
          stickyHeaderIndices={[0]}
          className="rounded-t-3xl bg-white pb-8"
          style={{
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}>
          <View className="flex-row items-center justify-between border-b border-gray-200 bg-white p-4">
            <Text className="text-xl font-semibold">
              {form.isUpdate ? 'Update Location' : 'Add Location'}
            </Text>
            <Pressable onPress={onClose} hitSlop={8} className="active:scale-95">
              <FontAwesome name="times" size={24} color="black" />
            </Pressable>
          </View>
          {loading ? (
            <View className="h-full items-center p-8">
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
                    onValueChange={(value) => setForm((prev) => ({ ...prev, hideLocation: value }))}
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
                {form.isUpdate && slug && (
                  <Pressable
                    onPress={() => onRemove(slug as string)}
                    className="flex-1 items-center justify-center rounded-lg bg-red-500 px-3 py-3 active:bg-red-400"
                    disabled={!location || !form.title}>
                    <Text className="text-center font-semibold text-white">Remove Location</Text>
                  </Pressable>
                )}
                <Pressable onPress={onClose} className="flex-1 items-center justify-center">
                  <Text className="text-center font-semibold text-black underline">Cancel</Text>
                </Pressable>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

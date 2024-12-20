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
import { useRouter } from 'expo-router';
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

export default function Publish() {
  const endJourney = useJourneyStore((state) => state.endJourney);
  const draftJourney = useJourneyStore((state) => state.draftJourney);

  const [form, setForm] = useState<any>(null);
  const router = useRouter();

  const onClose = () => {
    router.back();
  };

  const handleDiscard = () => {
    endJourney();
    onClose();
  };

  const onDiscard = () => {
    Alert.alert('Remove Location', 'Are you sure you want to remove this location?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      { text: 'Yes', onPress: handleDiscard, style: 'destructive' },
    ]);
  };

  const handleSubmit = () => {
    if (!draftJourney) return;
    onClose();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 justify-end">
      <ScrollView bounces stickyHeaderIndices={[0]} className="bg-white pb-8">
        <View className="flex-row items-center justify-between border-b border-gray-200 bg-white p-4">
          <Text className="text-xl font-semibold">Save Journey</Text>
          <Pressable onPress={onClose} hitSlop={8} className="active:scale-95">
            <FontAwesome name="times" size={24} color="black" />
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

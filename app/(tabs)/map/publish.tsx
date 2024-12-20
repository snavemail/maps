import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
  SafeAreaView,
} from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useJourneyStore } from '~/stores/useJourney';
import MainMapNonInteractive from '~/components/Maps/MainMapNonInteractive';
import LocationCard from '~/components/PublishLocationCard';

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

  const [title, setTitle] = useState(draftJourney?.title);
  const [description, setDescription] = useState(draftJourney?.description);
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
    <SafeAreaView className="flex-1">
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
          <View className="flex h-64 w-full bg-black">
            <MainMapNonInteractive />
          </View>

          <View className="p-4">
            <View className="gap-y-4">
              <View>
                <Text className="mb-1 text-sm text-gray-600">Title</Text>
                <TextInput
                  value={draftJourney?.title}
                  onChangeText={(text) => setTitle(text)}
                  className="rounded-lg border border-gray-200 p-3"
                  placeholder="Enter journey title"
                />
              </View>

              <View>
                <Text className="mb-1 text-sm text-gray-600">Description</Text>
                <TextInput
                  value={draftJourney?.description}
                  onChangeText={(text) => setDescription(text)}
                  className="rounded-lg border border-gray-200 p-3"
                  placeholder="Enter journey description"
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View>
                <Text className="mb-1 text-sm text-gray-600">Start Date</Text>
              </View>

              <View>
                <Text className="mb-3 text-sm text-gray-600">
                  Locations ({draftJourney?.locations.length})
                </Text>
                {draftJourney?.locations.map((location) => (
                  <LocationCard key={location.id} location={location} />
                ))}
              </View>
            </View>

            <View className="flex flex-col gap-4 py-4">
              <Pressable
                onPress={handleSubmit}
                className="flex-1 items-center justify-center rounded-lg bg-black px-3 py-3 active:bg-[#1f1f1f]"
                disabled={!draftJourney?.title || draftJourney?.locations.length === 0}>
                <Text className="text-center font-semibold text-white">Publish Journey</Text>
              </Pressable>
              <Pressable onPress={onDiscard} className="flex-1 items-center justify-center">
                <Text className="text-center font-semibold text-red-500 underline">Discard</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

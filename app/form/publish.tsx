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
import { journeyService } from '~/services/journeyService';

export default function Publish() {
  const endJourney = useJourneyStore((state) => state.endJourney);
  const draftJourney = useJourneyStore((state) => state.draftJourney);
  const updateJourney = useJourneyStore((state) => state.updateJourney);

  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async () => {
    if (!draftJourney) return;
    try {
      setLoading(true);
      updateJourney({ title, description });
      await journeyService.uploadJourney(draftJourney);
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Error uploading journey');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      {loading && (
        <View className="absolute inset-0 z-50">
          <View className="absolute inset-0 bg-white opacity-50" />
          <View className="absolute top-0 w-full">
            <View className="h-1 w-full bg-gray-200">
              <View className="h-full w-1/3 animate-[loading_1s_ease-in-out_infinite] bg-black" />
            </View>
          </View>
        </View>
      )}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-end">
        <ScrollView bounces stickyHeaderIndices={[0]} className="bg-white pb-8">
          <View className="flex-row items-center justify-between border-b border-gray-200 bg-white p-4">
            <Text className="text-xl font-semibold">Save Journey</Text>
            <Pressable onPress={onClose} hitSlop={8} className="active:scale-95" disabled={loading}>
              <FontAwesome name="times" size={24} color="black" />
            </Pressable>
          </View>
          <MainMapNonInteractive />

          <View className="p-4">
            <View className="gap-y-4">
              <View>
                <Text className="mb-1 text-sm text-gray-600">Title</Text>
                <TextInput
                  value={title}
                  onChangeText={(text) => setTitle(text)}
                  className="rounded-lg border border-gray-200 p-3"
                  placeholder="Enter journey title"
                  editable={!loading}
                />
              </View>

              <View>
                <Text className="mb-1 text-sm text-gray-600">Description</Text>
                <TextInput
                  value={description}
                  onChangeText={(text) => setDescription(text)}
                  className="rounded-lg border border-gray-200 p-3"
                  placeholder="Enter journey description"
                  multiline
                  numberOfLines={4}
                  editable={!loading}
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
                disabled={loading || !draftJourney?.title || draftJourney?.locations.length === 0}>
                <Text className="text-center font-semibold text-white">Publish Journey</Text>
              </Pressable>
              <Pressable
                onPress={onDiscard}
                className="flex-1 items-center justify-center"
                disabled={loading}>
                <Text className="text-center font-semibold text-red-500 underline">Discard</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

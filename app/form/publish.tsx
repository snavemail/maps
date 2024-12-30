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
  Switch,
} from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useJourneyStore } from '~/stores/useJourney';
import NonInteractiveMap from '~/components/Maps/MainMapNonInteractive';
import PublishLocationCard from '~/components/PublishLocationCard';
import { journeyService } from '~/services/journeyService';
import { X } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { useQueryClient } from '@tanstack/react-query';
import { useProfile } from '~/hooks/useProfile';
import { useColorScheme } from 'nativewind';

export default function Publish() {
  const endJourney = useJourneyStore((state) => state.endJourney);
  const draftJourney = useJourneyStore((state) => state.draftJourney);
  const updateJourney = useJourneyStore((state) => state.updateJourney);
  const queryClient = useQueryClient();
  const { profile } = useProfile();
  const { colorScheme } = useColorScheme();

  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState<string>(draftJourney?.title || '');
  const [description, setDescription] = useState<string>(draftJourney?.description || '');
  const [isPublic, setIsPublic] = useState<boolean>(draftJourney?.isPublic || false);
  const router = useRouter();

  const onClose = () => {
    router.back();
  };

  const handleDiscard = () => {
    endJourney();
    onClose();
  };

  const onDiscard = () => {
    Alert.alert('Discard Journey', 'Are you sure you want to discard this journey?', [
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
      updateJourney({ title, description, isPublic });
      await journeyService.uploadJourney({
        ...draftJourney,
        title,
        description,
        isPublic,
      });
      handleDiscard();
      queryClient.invalidateQueries({ queryKey: ['journeys', profile?.id] });
      Toast.show({
        type: 'success',
        text1: 'Success!',
        text2: 'Your journey has been uploaded',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: 'Please try again later',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      {loading && (
        <View className="absolute inset-0 z-50">
          <View className="absolute inset-0 bg-background opacity-50 dark:bg-background-dark" />
          <View className="absolute top-0 w-full">
            <View className="h-1 w-full bg-gray-200 dark:bg-gray-700">
              <View className="h-full w-1/3 animate-[loading_1s_ease-in-out_infinite] bg-primary dark:bg-primary-dark" />
            </View>
          </View>
        </View>
      )}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-end">
        <ScrollView
          bounces
          stickyHeaderIndices={[0]}
          className="bg-background pb-8 dark:bg-background-dark">
          <View className="flex-row items-center justify-between border-b border-gray-200 bg-background p-4 dark:border-gray-700 dark:bg-background-dark">
            <Text className="text-xl font-semibold text-text dark:text-text-dark">
              Save Journey
            </Text>
            <Pressable hitSlop={8} className="rounded-full p-2 active:scale-95" onPress={onClose}>
              <X size={24} color={colorScheme === 'dark' ? '#f1f1f1' : '#000'} />
            </Pressable>
          </View>
          <NonInteractiveMap />

          <View className="p-4">
            <View className="gap-y-4">
              <View>
                <Text className="mb-1 text-sm text-gray dark:text-gray-dark">Title</Text>
                <TextInput
                  value={title}
                  onChangeText={(text) => setTitle(text)}
                  className="rounded-lg border border-gray-700 p-3 text-text dark:border-gray-200 dark:text-text-dark"
                  placeholder="Enter journey title"
                  placeholderTextColor={colorScheme === 'dark' ? '#f2f2f2' : '#1f1f1f'}
                  editable={!loading}
                />
              </View>

              <View>
                <Text className="mb-1 text-sm text-gray dark:text-gray-dark">Description</Text>
                <TextInput
                  value={description}
                  onChangeText={(text) => setDescription(text)}
                  className="rounded-lg border border-gray-700 p-3 text-text dark:border-gray-200 dark:text-text-dark"
                  placeholder="Enter journey description"
                  placeholderTextColor={colorScheme === 'dark' ? '#f2f2f2' : '#1f1f1f'}
                  multiline
                  numberOfLines={4}
                  editable={!loading}
                />
              </View>

              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="font-medium text-text dark:text-text-dark">Public</Text>
                  <Text className="text-sm text-gray dark:text-gray-dark">
                    Keep this journey public?
                  </Text>
                </View>
                <Switch
                  style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                  value={isPublic}
                  onValueChange={(value) => setIsPublic(value)}
                  trackColor={{ true: '#60A5FA', false: '#767577' }}
                  thumbColor={isPublic ? '#0f58a0' : '#f4f3f4'}
                />
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="mb-1 text-sm text-gray dark:text-gray-dark">Start Date </Text>
                <Text className="text-md mb-1 text-gray dark:text-gray-dark">
                  {new Date(draftJourney?.startDate!).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
              </View>

              <View>
                <Text className="mb-3 text-sm text-gray dark:text-gray-dark">
                  Locations ({draftJourney?.locations.length})
                </Text>
                {draftJourney?.locations.map((location) => (
                  <PublishLocationCard key={location.id} location={location} />
                ))}
              </View>
            </View>

            <View className="flex flex-col gap-4 py-4">
              <Pressable
                onPress={handleSubmit}
                className="flex-1 items-center justify-center rounded-lg bg-primary px-3 py-3 active:bg-primary/80 dark:bg-primary-dark"
                disabled={loading || !draftJourney?.title || draftJourney?.locations.length === 0}>
                <Text className="text-center font-semibold text-white">Publish Journey</Text>
              </Pressable>
              <Pressable
                onPress={onDiscard}
                className="flex-1 items-center justify-center"
                disabled={loading}>
                <Text className="text-center font-semibold text-danger underline dark:text-danger">
                  Discard
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

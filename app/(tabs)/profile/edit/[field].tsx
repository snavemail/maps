import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useAuthStore } from '~/stores/useAuth';
import React from 'react';
import Toast from 'react-native-toast-message';

function isEditableField(field: string): field is SingleEditableField {
  return ['first_name', 'last_name', 'bio', 'avatar_url', 'birthday'].includes(field);
}

function EditFieldScreen() {
  const { field } = useLocalSearchParams<{ field: string }>();
  const profile = useAuthStore((state) => state.profile);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  if (!profile) return null;
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!field || !isEditableField(field)) {
    return (
      <View className="flex flex-row">
        <Text>Invalid field </Text>
        <Pressable onPress={() => router.back()}>Go Back</Pressable>
      </View>
    );
  }

  const [value, setValue] = useState(() => {
    switch (field) {
      case 'first_name':
        return profile.first_name;
      case 'last_name':
        return profile.last_name;
      case 'bio':
        return profile.bio;
      case 'birthday':
        return profile.birthday;
      default:
        return '';
    }
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile({ [field]: value });
      Toast.show({
        type: 'success',
        text1: 'Success!',
        text2: 'Your profile has been updated',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: 'Please try again later',
      });
    } finally {
      setLoading(false);
      router.back();
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: `Edit ${field}` }} />
      <View className="flex-1 bg-gray-50">
        <View className="mt-4 bg-white p-4">
          <Text className="mb-2 text-sm text-gray-600">{getFieldLabel(field as string)}</Text>
          <TextInput
            value={value}
            onChangeText={setValue}
            className="px-0 py-2 text-base"
            multiline={field === 'bio'}
            numberOfLines={field === 'bio' ? 4 : 1}
            autoCapitalize={field === 'first_name' || field === 'last_name' ? 'words' : 'none'}
            keyboardType={'default'}
          />
        </View>

        {/* Save Button */}
        <View className="mt-auto p-4">
          <Pressable
            className="w-full items-center rounded-full bg-black py-3"
            onPress={handleSave}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="font-medium text-white">Save Changes</Text>
            )}
          </Pressable>
        </View>
      </View>
    </>
  );
}

// Helper function for field labels
function getFieldLabel(field: string) {
  switch (field) {
    case 'name':
      return 'Your full name';
    case 'bio':
      return 'Write a short bio about yourself';
    case 'location':
      return 'Your location';
    case 'email':
      return 'Your email address';
    default:
      return '';
  }
}

export default EditFieldScreen;

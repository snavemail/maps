import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useAuthStore } from '~/stores/useAuth';
import { profileService } from '~/services/profileService';

function isEditableField(field: string): field is SingleEditableField {
  return ['first_name', 'last_name', 'bio', 'avatar_url', 'birthday'].includes(field);
}

function EditFieldScreen() {
  const { field } = useLocalSearchParams<{ field: string }>();
  const profile = useAuthStore((state) => state.profile);
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
      await profileService.update({ [field]: value });
      alert('Profile updated successfully');
    } catch (error) {
      alert('An error occurred while updating your profile');
    } finally {
      setLoading(false);
      router.replace('/(tabs)/profile/edit');
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

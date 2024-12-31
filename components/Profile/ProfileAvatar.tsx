import React, { useState } from 'react';
import { View, Image, Pressable, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { profileService } from '~/services/profileService';
import * as FileSystem from 'expo-file-system';
import { useAuthStore } from '~/stores/useAuth';
import { Camera, UserCircle, UserRoundIcon } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { useProfile } from '~/hooks/useProfile';
import { useColorScheme } from 'nativewind';

export default function ProfileAvatar({ userID, profile }: { userID: string; profile: any }) {
  const { updateProfile } = useProfile();
  const [loading, setLoading] = useState(false);
  const processImage = async (uri: string): Promise<string> => {
    const image = await ImageManipulator.manipulate(uri).resize({ width: 1080 }).renderAsync();
    const result = await image.saveAsync({
      compress: 0.7,
      format: SaveFormat.JPEG,
    });
    return result.uri;
  };
  const { colorScheme } = useColorScheme();
  const handlePhotoChange = async () => {
    try {
      setLoading(true);
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        allowsMultipleSelection: false,
        aspect: [1, 1],
        quality: 1,
      });

      if (pickerResult.canceled) return;

      const processedUri = await processImage(pickerResult.assets[0].uri);
      const base64 = await FileSystem.readAsStringAsync(processedUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const contentType = 'image/jpeg';

      const avatarURL = await profileService.uploadAvatar(base64, contentType, userID);

      await profileService.saveAvatarUrl(userID, avatarURL);
      await updateProfile({ avatar_url: avatarURL });
      Toast.show({
        type: 'success',
        text1: 'Success!',
        text2: 'Your profile picture has been updated',
      });
    } catch (error) {
      console.error('Error updating avatar:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update your profile picture. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable onPress={handlePhotoChange}>
      <View className="relative">
        <View className="flex size-24 items-center justify-center rounded-full border-none border-[#f1f1f1] dark:border-black ">
          {loading ? (
            <ActivityIndicator size="large" color="#000" />
          ) : (
            <>
              {profile.avatar_url ? (
                <Image
                  source={{
                    uri: profile.avatar_url ?? '',
                  }}
                  className="size-24 rounded-full"
                />
              ) : (
                <UserCircle size={80} color={colorScheme === 'dark' ? '#ccc' : '#444'} />
              )}
            </>
          )}
        </View>
        <View className="absolute bottom-0 right-0 rounded-full bg-black/50 p-2">
          <Camera size={19} color="#fff" />
        </View>
      </View>
    </Pressable>
  );
}

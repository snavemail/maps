import React, { useState } from 'react';
import { View, Image, Pressable, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { FontAwesome } from '@expo/vector-icons';
import { profileService } from '~/services/profileService';
import * as FileSystem from 'expo-file-system';

export default function ProfileAvatar({ userID, profile }: { userID: string; profile: any }) {
  const [loading, setLoading] = useState(false);
  const processImage = async (uri: string): Promise<string> => {
    const image = await ImageManipulator.manipulate(uri).resize({ width: 1080 }).renderAsync();
    const result = await image.saveAsync({
      compress: 0.7,
      format: SaveFormat.JPEG,
    });
    return result.uri;
  };
  const handlePhotoChange = async () => {
    try {
      setLoading(true);
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        allowsMultipleSelection: false,
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
      await profileService.update({ avatar_url: avatarURL });
      Alert.alert('Success', 'Your profile picture has been updated!');
    } catch (error) {
      console.error('Error updating avatar:', error);
      Alert.alert('Error', 'Failed to update your profile picture. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable onPress={handlePhotoChange}>
      <View className="relative">
        {loading ? (
          <View className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-black">
            <ActivityIndicator size="large" color="#000" />
          </View>
        ) : (
          <Image
            source={{
              uri:
                profile.avatar_url ??
                'https://images.unsplash.com/photo-1522163182402-834f871fd851',
            }}
            className="h-24 w-24 rounded-full border-4 border-black"
          />
        )}
        <View className="absolute bottom-0 right-0 rounded-full bg-black/50 p-2">
          <FontAwesome name="camera" size={16} color="white" />
        </View>
      </View>
    </Pressable>
  );
}

import { View, Text, Image, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import ShareProfileButton from './ShareProfileButton';
import { useRouter } from 'expo-router';
import { useAuthStore } from '~/stores/useAuth';
type ProfileHeaderProps = {
  user: Profile;
};

function ProfileHeader({ user }: ProfileHeaderProps) {
  const router = useRouter();
  const self = useAuthStore((state) => state.user);
  const isOwnProfile = user.id === self?.id;
  return (
    <View className="bg-white">
      {/* Profile Info Section */}
      <View className="p-4">
        <View className="flex-row items-end justify-between">
          <Image
            source={{
              uri:
                user.avatar_url ?? 'https://images.unsplash.com/photo-1522163182402-834f871fd851',
            }}
            className="h-24 w-24 rounded-full border-4 border-black"
          />
        </View>

        {/* Name and Bio */}
        <View className="mb-4">
          <Text className="text-2xl font-bold">
            {user.first_name} {user.last_name}
          </Text>
          {user.city && user.state && (
            <Text className="mt-1 text-gray-600">
              {user.city}, {user.state}
            </Text>
          )}
          {user.bio && <Text className="mt-2 leading-5 text-gray-600">{user.bio}</Text>}
        </View>

        {/* Stats */}
        <View className="flex-row justify-around border-b border-t border-gray-100 py-4">
          <View className="items-center">
            <Text className="text-lg font-bold">{100}</Text>
            <Text className="text-gray-600">Journeys</Text>
          </View>
          <View className="items-center">
            <Text className="text-lg font-bold">{101}</Text>
            <Text className="text-gray-600">Followers</Text>
          </View>
          <View className="items-center">
            <Text className="text-lg font-bold">{88}</Text>
            <Text className="text-gray-600">Following</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="mt-4 flex-row gap-2">
          {isOwnProfile ? (
            <Pressable
              className="flex-1 flex-row items-center justify-center rounded-full bg-gray-100 px-4 py-2"
              onPress={() => router.push('/profile/edit')}
              style={({ pressed }) => (pressed ? { opacity: 0.7 } : {})}>
              <FontAwesome name="cog" size={16} color="black" className="mr-2" />
              <Text className="font-medium">Edit Profile</Text>
            </Pressable>
          ) : (
            <Pressable
              className="flex-1 flex-row items-center justify-center rounded-full bg-black px-4 py-2"
              style={({ pressed }) => (pressed ? { opacity: 0.7 } : {})}>
              <FontAwesome name="plus" size={16} color="white" className="mr-2" />
              <Text className="font-medium text-white">Follow</Text>
            </Pressable>
          )}
          <ShareProfileButton user={user} />
        </View>
      </View>
    </View>
  );
}

export default ProfileHeader;

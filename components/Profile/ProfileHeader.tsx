import { View, Text, Image, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '~/stores/useAuth';
import { Settings, UserPen } from 'lucide-react-native';

type ProfileHeaderProps = {
  user: Profile;
  journeyCount?: number;
  followersCount?: number;
  followingCount?: number;
};

function ProfileHeader({
  user,
  journeyCount = 0,
  followersCount = 0,
  followingCount = 0,
}: ProfileHeaderProps) {
  const router = useRouter();
  const self = useAuthStore((state) => state.user);
  const isOwnProfile = user.id === self?.id;

  return (
    <View className="bg-white px-4 pt-3">
      {/* Header Section with Avatar and Edit/Follow Button */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-4">
          <Image
            source={{
              uri:
                user.avatar_url ?? 'https://images.unsplash.com/photo-1522163182402-834f871fd851',
            }}
            className="h-20 w-20 rounded-full border-2 border-gray-200"
          />
          <View>
            <Text className="text-xl font-bold">
              {user.first_name} {user.last_name}
            </Text>
            {user.city && user.state && (
              <Text className="text-sm text-gray-500">
                {user.city}, {user.state}
              </Text>
            )}
          </View>
        </View>

        {/* Action Button */}
        {isOwnProfile ? (
          <Pressable
            className="flex flex-row items-center gap-2 rounded-full bg-gray-100 px-3 py-2"
            onPress={() => router.push('/profile/edit')}
            style={({ pressed }) => (pressed ? { opacity: 0.7 } : {})}>
            <UserPen size={20} color="black" />
            <Text>Edit</Text>
          </Pressable>
        ) : (
          <Pressable
            className="rounded-full bg-black px-3 py-2"
            style={({ pressed }) => (pressed ? { opacity: 0.7 } : {})}>
            <Text className="font-medium text-white">Follow</Text>
          </Pressable>
        )}
      </View>

      {/* Bio Section */}
      {user.bio && <Text className="mt-3 leading-5 text-gray-600">{user.bio}</Text>}

      {/* Stats Section */}
      <View className="mt-4 flex-row justify-between">
        <View className="flex-1 items-center border-r border-gray-200 py-2">
          <Text className="text-xl font-bold">{journeyCount}</Text>
          <Text className="text-sm text-gray-500">Journeys</Text>
        </View>
        <View className="flex-1 items-center border-r border-gray-200 py-2">
          <Text className="text-xl font-bold">{followersCount}</Text>
          <Text className="text-sm text-gray-500">Followers</Text>
        </View>
        <View className="flex-1 items-center py-2">
          <Text className="text-xl font-bold">{followingCount}</Text>
          <Text className="text-sm text-gray-500">Following</Text>
        </View>
      </View>
    </View>
  );
}

export default ProfileHeader;

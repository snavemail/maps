import { View, Text, Image, Pressable } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '~/stores/useAuth';
import { UserPen } from 'lucide-react-native';
import { useSegments } from 'expo-router';
import ToFollowsButton from '../Buttons/ToFollowsButton';
import StatItem from './StatItem';

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
  const segments = useSegments();
  const isProfilePage = segments.includes('me' as never);

  return (
    <View className="dark:bg-surface-dark-elevated bg-white px-6 pb-4 pt-6">
      <View className="mb-4 flex-row items-center justify-between">
        <View className="flex-row items-center gap-4">
          <Image
            source={{
              uri:
                user.avatar_url ?? 'https://images.unsplash.com/photo-1522163182402-834f871fd851',
            }}
            className="border-primary/10 dark:border-primary-dark/10 h-24 w-24 rounded-full border-2"
          />
          <View>
            <Text className="font-display text-heading-1 text-text dark:text-text-dark">
              {user.first_name} {user.last_name}
            </Text>
            {user.city && user.state && (
              <Text className="text-body-medium text-text-secondary dark:text-text-dark-secondary mt-1 font-sans">
                {user.city}, {user.state}
              </Text>
            )}
          </View>
        </View>

        {isOwnProfile && isProfilePage && (
          <Pressable
            className="border-primary dark:border-primary-dark flex-row items-center gap-2 rounded-lg border-2 bg-white px-4 py-2"
            onPress={() => router.push('/(tabs)/me/edit')}>
            <UserPen size={20} color={'#0f58a0'} />
            <Text className="text-button-label text-primary dark:text-primary-dark font-sans">
              Edit
            </Text>
          </Pressable>
        )}

        {!isOwnProfile && (
          <Pressable className="bg-primary dark:bg-primary-dark rounded-full px-5 py-2.5">
            <Text className="text-button-label font-sans text-white">Follow</Text>
          </Pressable>
        )}
      </View>

      {user.bio && (
        <Text className="text-body-medium text-text-secondary dark:text-text-dark-secondary mb-6 font-sans">
          {user.bio}
        </Text>
      )}

      <View className="mt-4 flex-row justify-between">
        <View className="flex-1 items-center border-r border-gray-200 py-2">
          <Text className="text-xl font-bold">{journeyCount}</Text>
          <Text className="text-sm text-gray-500">Journeys</Text>
        </View>
        <View className="flex-1 items-center border-r border-gray-200 py-2">
          <ToFollowsButton profileID={user.id} tab="Followers">
            <View className="items-center">
              <Text className="text-xl font-bold">{followersCount}</Text>
              <Text className="text-sm text-gray-500">Followers</Text>
            </View>
          </ToFollowsButton>
        </View>
        <View className="flex-1 items-center py-2">
          <ToFollowsButton profileID={user.id} tab="Following">
            <View className="items-center">
              <Text className="text-xl font-bold">{followingCount}</Text>
              <Text className="text-sm text-gray-500">Following</Text>
            </View>
          </ToFollowsButton>
        </View>
      </View>
    </View>
  );
}

export default ProfileHeader;

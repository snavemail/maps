import { View, Text, Image, Pressable, ActivityIndicator } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '~/stores/useAuth';
import { UserCircle, UserPen } from 'lucide-react-native';
import { useSegments } from 'expo-router';
import ToFollowsButton from '../Buttons/ToFollowsButton';
import FollowButton from '../FollowButton';
import { useProfile, useUserProfile } from '~/hooks/useProfile';

type ProfileHeaderProps = {
  user: Profile;
};

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const router = useRouter();
  const self = useAuthStore((state) => state.user);
  const isOwnProfile = user.id === self?.id;
  const segments = useSegments();
  const isProfilePage = segments.includes('me' as never);

  // Use the appropriate hook based on whether it's the user's own profile
  const { stats, journeyStats, isLoading } = isOwnProfile ? useProfile() : useUserProfile(user.id);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0f58a0" />
      </View>
    );
  }

  // Render different buttons based on profile type
  const renderActionButton = () => {
    if (isOwnProfile && isProfilePage) {
      return (
        <Pressable
          className="flex-row items-center gap-2 rounded-lg border-2 border-primary bg-white px-4 py-2 dark:border-primary-dark"
          onPress={() => router.push('/(tabs)/me/edit')}>
          <UserPen size={20} color={'#0f58a0'} />
          <Text className="font-sans text-button-label text-primary dark:text-primary-dark">
            Edit
          </Text>
        </Pressable>
      );
    }

    if (!isOwnProfile) {
      return <FollowButton userID={user.id} />;
    }

    return null;
  };

  return (
    <View className="bg-white px-6 pb-4 pt-6 dark:bg-surface-dark-elevated">
      <View className="mb-4 flex-row items-center justify-between">
        <View className="flex-row items-center gap-4">
          {user.avatar_url ? (
            <Image
              source={{
                uri: user.avatar_url ?? '',
              }}
              className="h-24 w-24 rounded-full border-2 border-primary/10 dark:border-primary-dark/10"
            />
          ) : (
            <View className="h-24 w-24 rounded-full border-2 border-primary/10 dark:border-primary-dark/10">
              <UserCircle size={96} color="#0f58a0" />
            </View>
          )}
          <View>
            <Text className="font-display text-heading-1 text-text dark:text-text-dark">
              {user.first_name} {user.last_name}
            </Text>
            {user.city && user.state && (
              <Text className="mt-1 font-sans text-body-medium text-text-secondary dark:text-text-dark-secondary">
                {user.city}, {user.state}
              </Text>
            )}
          </View>
        </View>

        {renderActionButton()}
      </View>

      {user.bio && (
        <Text className="mb-6 font-sans text-body-medium text-text-secondary dark:text-text-dark-secondary">
          {user.bio}
        </Text>
      )}

      <View className="mt-4 flex-row justify-between">
        <View className="flex-1 items-center border-r border-gray-200 py-2">
          <Text className="text-xl font-bold">{journeyStats?.totalJourneys ?? 0}</Text>
          <Text className="text-sm text-gray-500">Journeys</Text>
        </View>
        <View className="flex-1 items-center border-r border-gray-200 py-2">
          <ToFollowsButton profileID={user.id} tab="Followers">
            <View className="items-center">
              <Text className="text-xl font-bold">{stats?.followers ?? 0}</Text>
              <Text className="text-sm text-gray-500">Followers</Text>
            </View>
          </ToFollowsButton>
        </View>
        <View className="flex-1 items-center py-2">
          <ToFollowsButton profileID={user.id} tab="Following">
            <View className="items-center">
              <Text className="text-xl font-bold">{stats?.following ?? 0}</Text>
              <Text className="text-sm text-gray-500">Following</Text>
            </View>
          </ToFollowsButton>
        </View>
      </View>
    </View>
  );
}

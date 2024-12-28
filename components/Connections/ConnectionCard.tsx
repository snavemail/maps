import { View, Text, Pressable, Image } from 'react-native';
import React from 'react';
import ToProfileButton from '~/components/Buttons/ToProfileButton';
import FollowButton from '~/components/FollowButton';
import { useColorScheme } from 'react-native';
import { UserCircle } from 'lucide-react-native';

type Connection = {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
  followed_at: string;
  is_following: boolean;
};

export default function ConnectionCard({ user }: { user: Connection | undefined }) {
  if (!user) return null;
  const colorScheme = useColorScheme();
  return (
    <View className="flex-row items-center justify-between bg-background p-4 dark:bg-background-dark">
      <ToProfileButton profileID={user.id}>
        <View className="flex-1 flex-row items-center">
          <View className="h-12 w-12 overflow-hidden rounded-full bg-secondary-100 dark:bg-secondary-dark-200">
            {user.avatar_url ? (
              <Image source={{ uri: user.avatar_url }} className="h-full w-full" />
            ) : (
              <View className="h-full w-full items-center justify-center">
                <UserCircle size={48} color={colorScheme === 'dark' ? '#ccc' : '#444'} />
              </View>
            )}
          </View>

          <Text className="ml-3 font-sans text-card-title text-text dark:text-text-dark">
            {user.first_name} {user.last_name}
          </Text>
        </View>
      </ToProfileButton>
      <FollowButton userID={user.id} />
    </View>
  );
}

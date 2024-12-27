import { View, Text, Pressable, Image } from 'react-native';
import React from 'react';
import ToProfileButton from '~/components/Buttons/ToProfileButton';
import FollowButton from '~/components/FollowButton';

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

  const handleToggleFollow = () => {
    // TODO: Implement follow/unfollow logic
    console.log('Toggle follow for:', user.id);
  };

  return (
    <View className="bg-surface dark:bg-surface-dark border-border dark:border-border-dark flex-row items-center justify-between border-b p-4">
      <ToProfileButton profileID={user.id}>
        <View className="flex-1 flex-row items-center">
          <View className="bg-secondary-100 dark:bg-secondary-dark-200 h-12 w-12 overflow-hidden rounded-full">
            <Image source={{ uri: user.avatar_url }} className="h-full w-full" />
          </View>

          <Text className="text-card-title text-text dark:text-text-dark ml-3 font-sans">
            {user.first_name} {user.last_name}
          </Text>
        </View>
      </ToProfileButton>

      {/* <Pressable
        onPress={handleToggleFollow}
        className={`rounded-full px-4 py-2 ${
          user.is_following
            ? 'border-border dark:border-border-dark bg-secondary-50 dark:bg-secondary-dark-100 border'
            : 'bg-primary dark:bg-primary-dark'
        }`}>
        <Text
          className={`text-button-label ${
            user.is_following ? 'text-text-secondary dark:text-text-dark-secondary' : 'text-white'
          }`}>
          {user.is_following ? 'Following' : 'Follow'}
        </Text>
      </Pressable> */}
      <FollowButton userId={user.id} />
    </View>
  );
}

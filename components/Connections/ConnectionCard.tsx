import { View, Text, Pressable, Image } from 'react-native';
import React from 'react';
import ToProfileButton from '~/components/Buttons/ToProfileButton';

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
    <View className="flex-row items-center justify-between bg-white p-4">
      <ToProfileButton profileID={user.id}>
        <View className="flex-1 flex-row items-center">
          <View className="h-12 w-12 overflow-hidden rounded-full">
            <Image source={{ uri: user.avatar_url }} className="h-full w-full" />
          </View>
          <Text className="ml-3 text-base font-medium">
            {user.first_name} {user.last_name}
          </Text>
        </View>
      </ToProfileButton>
      <Pressable
        onPress={handleToggleFollow}
        className={`rounded-full px-4 py-2 ${
          user.is_following ? 'border border-gray-300 bg-gray-100' : 'bg-purple-700'
        }`}>
        <Text
          className={`text-sm font-medium ${user.is_following ? 'text-gray-900' : 'text-white'}`}>
          {user.is_following ? 'Following' : 'Follow'}
        </Text>
      </Pressable>
    </View>
  );
}

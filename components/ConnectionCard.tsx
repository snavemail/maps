import { View, Text } from 'react-native';
import React from 'react';

export default function ConnectionCard({ profile }: { profile: Profile }) {
  return (
    <View className="flex-row items-center justify-between">
      <Text>
        {profile.first_name} {profile.last_name}
      </Text>
    </View>
  );
}

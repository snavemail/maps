import { View, Text, ScrollView } from 'react-native';
import React from 'react';

import ProfileHeader from '~/components/Profile/ProfileHeader';
import StatItem from '~/components/Profile/StatItem';

export default function ProfilePage({ profile }: { profile: ProfileWithStats }) {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <ProfileHeader
        user={profile}
        journeyCount={profile.totalJourneys}
        followersCount={profile.followers}
        followingCount={profile.following}
      />

      <View className="mt-4 rounded-xl bg-white p-4 shadow-sm">
        <View className="flex-row justify-around">
          <StatItem icon="MapPin" label="Locations" value={profile.totalJourneys} />
          <StatItem icon="Calendar" label="Active Days" value={profile.recentJourneys} />
        </View>
      </View>

      {/* Recent Activity */}
      <View className="mt-4 rounded-xl bg-white p-4 shadow-sm">
        <Text className="mb-3 text-lg font-bold">Recent Activity</Text>
      </View>
    </ScrollView>
  );
}

import { View, Text, ScrollView } from 'react-native';
import React from 'react';

import ProfileHeader from '~/components/Profile/ProfileHeader';
import StatItem from '~/components/Profile/StatItem';
import { useUserProfile } from '~/hooks/useProfile';

export default function ProfilePage({
  profile,
  journeyStats,
}: {
  profile: Profile;
  journeyStats: JourneyStats;
}) {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <ProfileHeader user={profile} />

      <View className="mt-4 rounded-xl bg-white p-4 shadow-sm">
        <View className="flex-row justify-around">
          <StatItem icon="MapPin" label="Locations" value={journeyStats?.totalJourneys ?? 0} />
          <StatItem icon="Calendar" label="Active Days" value={journeyStats?.recentJourneys ?? 0} />
        </View>
      </View>

      {/* Recent Activity */}
      <View className="mt-4 rounded-xl bg-white p-4 shadow-sm">
        <Text className="mb-3 text-lg font-bold">Recent Activity</Text>
      </View>
    </ScrollView>
  );
}

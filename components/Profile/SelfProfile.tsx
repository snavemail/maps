import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import ProfileHeader from './ProfileHeader';
import StatItem from '~/components/Profile/StatItem';
import QuickLink from '~/components/Profile/QuickLink';

export default function SelfProfile({
  stats,
  followCounts,
  profile,
}: {
  stats: UserStats;
  followCounts: { followers: number; following: number };
  profile: Profile;
}) {
  return (
    <ScrollView className="flex-1 gap-y-2 bg-gray-50">
      <ProfileHeader
        user={profile}
        journeyCount={stats.totalJourneys}
        followersCount={followCounts.followers}
        followingCount={followCounts.following}
      />

      <View className=" bg-white p-4">
        <Text className="mb-3 text-lg font-bold">Your Stats</Text>
        <View className="flex-row flex-wrap justify-between">
          <StatItem icon="MapPin" label="Total Locations" value={stats.totalJourneys} />
          <StatItem
            icon="Calendar"
            label="Recent Journeys"
            value={stats.recentJourneys}
            subtitle="Last 7 days"
          />
        </View>
      </View>
      <View className=" bg-white p-4">
        <View className="gap-y-2">
          <QuickLink
            iconName="Route"
            label="Past Journeys"
            onPress={() => router.push('/(tabs)/journeys')}
          />
          <QuickLink
            iconName="Settings"
            label="Edit Profile"
            onPress={() => router.push('/profile/edit')}
          />
          <QuickLink
            iconName="Lock"
            label="Privacy Settings"
            onPress={() => router.push('/profile/privacy')}
          />
        </View>
      </View>
    </ScrollView>
  );
}

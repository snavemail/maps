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
    <ScrollView className="flex-1 bg-gray-50">
      <ProfileHeader
        user={profile}
        journeyCount={stats.totalJourneys}
        followersCount={followCounts.followers}
        followingCount={followCounts.following}
      />

      <View className="mt-4 rounded-xl bg-white p-4 shadow-sm">
        <Text className="mb-3 text-lg font-bold">Your Stats</Text>
        <View className="flex-row flex-wrap justify-between">
          <StatItem icon="map-marker" label="Total Locations" value={stats.totalJourneys} />
          <StatItem
            icon="calendar"
            label="Recent Journeys"
            value={stats.recentJourneys}
            subtitle="Last 7 days"
          />
        </View>
      </View>
      <View className="mt-4 rounded-xl bg-white p-4 shadow-sm">
        <View className="gap-y-2">
          <QuickLink
            icon="bookmark"
            label="Saved Locations"
            onPress={() => router.push('/(tabs)/journeys')}
          />
          <QuickLink icon="cog" label="Edit Profile" onPress={() => router.push('/profile/edit')} />
          <QuickLink
            icon="lock"
            label="Privacy Settings"
            onPress={() => router.push('/profile/privacy')}
          />
        </View>
      </View>
    </ScrollView>
  );
}

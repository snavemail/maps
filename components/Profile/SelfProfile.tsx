import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import ProfileHeader from './ProfileHeader';
import StatItem from '~/components/Profile/StatItem';
import QuickLink from '~/components/Profile/QuickLink';

export default function SelfProfile({ profile }: { profile: ProfileWithStats }) {
  return (
    <ScrollView className="flex-1 gap-y-2 bg-gray-50">
      <ProfileHeader
        user={profile}
        journeyCount={profile.totalJourneys}
        followersCount={profile.followers}
        followingCount={profile.following}
      />

      <View className=" bg-white p-4">
        <Text className="mb-3 text-lg font-bold">Your Stats</Text>
        <View className="flex-row flex-wrap justify-between">
          <StatItem icon="MapPin" label="Total Locations" value={profile.totalJourneys} />
          <StatItem
            icon="Calendar"
            label="Recent Journeys"
            value={profile.recentJourneys}
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
            onPress={() => router.push('/(tabs)/me/edit')}
          />
        </View>
      </View>
    </ScrollView>
  );
}

import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import ProfileHeader from './ProfileHeader';
import StatItem from '~/components/Profile/StatItem';
import QuickLink from '~/components/Profile/QuickLink';

export default function SelfProfile({ profile }: { profile: ProfileWithStats }) {
  return (
    <ScrollView className="bg-surface dark:bg-surface-dark flex-1">
      <ProfileHeader
        user={profile}
        journeyCount={profile.totalJourneys}
        followersCount={profile.followers}
        followingCount={profile.following}
      />

      <View className="dark:bg-surface-dark-elevated bg-white px-4 py-6">
        <Text className="font-display text-heading-2 text-text dark:text-text-dark mb-4">
          Your Stats
        </Text>
        <View className="flex-row justify-around">
          <StatItem icon="MapPin" label="Total Locations" value={profile.totalJourneys} />
          <StatItem
            icon="Calendar"
            label="Recent Journeys"
            value={profile.recentJourneys}
            subtitle="Last 7 days"
          />
        </View>
      </View>

      <View className="dark:bg-surface-dark-elevated mt-2 bg-white">
        <View className="px-4">
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

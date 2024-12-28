import { View, Text, ScrollView } from 'react-native';
import React, { useEffect } from 'react';
import { router } from 'expo-router';
import ProfileHeader from './ProfileHeader';
import StatItem from '~/components/Profile/StatItem';
import QuickLink from '~/components/Profile/QuickLink';
import { useProfile } from '~/hooks/useProfile';

export default function SelfProfile() {
  const { profile, journeyStats } = useProfile();
  if (!profile) return null;

  return (
    <ScrollView className="flex-1 bg-surface dark:bg-surface-dark">
      <ProfileHeader user={profile} />

      <View className="bg-white px-4 py-6 dark:bg-surface-dark-elevated">
        <Text className="mb-4 font-display text-heading-2 text-text dark:text-text-dark">
          Your Stats
        </Text>
        <View className="flex-row justify-around">
          <StatItem
            icon="MapPin"
            label="Total Locations"
            value={journeyStats?.totalJourneys ?? 0}
          />
          <StatItem
            icon="Calendar"
            label="Recent Journeys"
            value={journeyStats?.recentJourneys ?? 0}
            subtitle="Last 7 days"
          />
        </View>
      </View>

      <View className="mt-2 bg-white dark:bg-surface-dark-elevated">
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

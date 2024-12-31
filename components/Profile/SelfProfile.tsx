import { View, Text, ScrollView } from 'react-native';
import React, { useEffect } from 'react';
import { router } from 'expo-router';
import ProfileHeader from './ProfileHeader';
import StatItem from '~/components/Profile/StatItem';
import QuickLink from '~/components/Profile/QuickLink';
import { useProfile } from '~/hooks/useProfile';
import { useColorScheme } from 'nativewind';
import { MapView } from '@rnmapbox/maps';

export default function SelfProfile() {
  const { profile, journeyStats } = useProfile();
  if (!profile) return null;

  return (
    <ScrollView className="flex-1 bg-background dark:bg-background-dark">
      <ProfileHeader user={profile} />

      <View className="flex flex-col gap-y-2 bg-background py-6 dark:bg-background-dark">
        <View className="flex-1 overflow-hidden rounded-none">
          <StatItem
            icon="MapPin"
            label="Total Journeys"
            value={journeyStats?.totalJourneys ?? 0}
            color="pink"
          />
        </View>
        <View className="flex-1 overflow-hidden rounded-none">
          <StatItem
            icon="MapPin"
            label="Total Locations"
            value={journeyStats?.totalLocations ?? 0}
            color="orange"
          />
        </View>
        <View className="flex-1 overflow-hidden rounded-none">
          <StatItem
            icon="Calendar"
            label="Journeys this week"
            value={journeyStats?.recentJourneys ?? 0}
            color="green"
          />
        </View>
        <View className="flex-1 overflow-hidden rounded-none">
          <StatItem
            icon="Ruler"
            label="Distance this week (mi)"
            value={journeyStats?.recentDistance ?? 0}
            color="purple"
          />
        </View>
      </View>

      <View className="mt-2 bg-background dark:bg-background-dark">
        <View className="px-4">
          <QuickLink
            iconName="Route"
            label="Past Journeys"
            onPress={() => router.push('/(tabs)/journeys')}
          />
        </View>
      </View>
    </ScrollView>
  );
}

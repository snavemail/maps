import { View, Text, ScrollView, Pressable, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuthStore } from '~/stores/useAuth';
import ProfileHeader from '~/components/ProfileHeader';
import { profileService } from '~/services/profileService';
import { useProfileCache } from '~/stores/useProfileCache';

export default function ProfileScreen() {
  const router = useRouter();
  const { slug } = useLocalSearchParams();
  const self = useAuthStore((state) => state.user);
  const cachedProfile = useProfileCache().getProfile((slug as string) || self?.id || '');
  const [stats, setStats] = useState<UserStats>({
    totalJourneys: 0,
    recentJourneys: 0,
  });
  const [profile, setProfile] = useState<Profile | null>(null);
  const [followCounts, setFollowCounts] = useState<{ followers: number; following: number }>({
    followers: 0,
    following: 0,
  });
  const isOwnProfile = !slug || slug === self?.id;

  useEffect(() => {
    if (cachedProfile) {
      setProfile(cachedProfile);
    }
  }, [cachedProfile]);

  useEffect(() => {
    fetchProfile();
    fetchStats();
    fetchFollowCounts();
  }, [slug]);

  const fetchProfile = async () => {
    const profile = await profileService.fetchProfile((slug as string) || self?.id || '');
    setProfile(profile);
  };

  const fetchFollowCounts = async () => {
    const followCounts = await profileService.fetchFollowCounts((slug as string) || self?.id || '');
    setFollowCounts(followCounts);
  };

  const fetchStats = async () => {
    const stats = await profileService.fetchStats((slug as string) || self?.id || '');
    setStats(stats);
  };

  if (!profile) return null;

  if (isOwnProfile) {
    return (
      <ScrollView className="flex-1 bg-gray-50">
        <ProfileHeader
          user={profile}
          journeyCount={stats.totalJourneys}
          followersCount={followCounts.followers}
          followingCount={followCounts.following}
        />

        {/* Quick Stats */}
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

        {/* Quick Links */}
        <View className="mt-4 rounded-xl bg-white p-4 shadow-sm">
          <Text className="mb-3 text-lg font-bold">Quick Links</Text>
          <View className="space-y-2">
            <QuickLink
              icon="bookmark"
              label="Saved Locations"
              onPress={() => router.push('/(tabs)/journeys')}
            />
            <QuickLink
              icon="cog"
              label="Edit Profile"
              onPress={() => router.push('/profile/edit')}
            />
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

  // Other User's Profile View
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <ProfileHeader
        user={profile}
        journeyCount={stats.totalJourneys}
        followersCount={followCounts.followers}
        followingCount={followCounts.following}
      />

      <View className="mt-4 rounded-xl bg-white p-4 shadow-sm">
        <View className="flex-row justify-around">
          <StatItem icon="map-marker" label="Locations" value={stats.totalJourneys} />
          <StatItem icon="calendar" label="Active Days" value={stats.recentJourneys} />
        </View>
      </View>

      {/* Recent Activity */}
      <View className="mt-4 rounded-xl bg-white p-4 shadow-sm">
        <Text className="mb-3 text-lg font-bold">Recent Activity</Text>
      </View>
    </ScrollView>
  );
}

const StatItem = ({
  icon,
  label,
  value,
  subtitle,
}: {
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  label: string;
  value: number;
  subtitle?: string;
}) => (
  <View className="items-center px-2 py-1">
    <FontAwesome name={icon} size={20} color="#374151" />
    <Text className="mt-1 text-2xl font-bold">{value}</Text>
    <Text className="text-sm text-gray-600">{label}</Text>
    {subtitle && <Text className="text-xs text-gray-400">{subtitle}</Text>}
  </View>
);

const QuickLink = ({
  icon,
  label,
  onPress,
}: {
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  label: string;
  onPress: () => void;
}) => (
  <Pressable
    className="flex-row items-center rounded-lg bg-gray-50 p-3"
    onPress={onPress}
    style={({ pressed }) => (pressed ? { opacity: 0.7 } : {})}>
    <FontAwesome name={icon} size={20} color="#374151" />
    <Text className="ml-3 flex-1 font-medium">{label}</Text>
    <FontAwesome name="chevron-right" size={16} color="#9CA3AF" />
  </Pressable>
);

import { View, Text, ScrollView, Pressable, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuthStore } from '~/stores/useAuth';
import ProfileHeader from '~/components/Profile/ProfileHeader';
import { profileService } from '~/services/profileService';
import { useProfileCache } from '~/stores/useProfileCache';
import SelfProfile from '~/components/Profile/SelfProfile';
import StatItem from '~/components/Profile/StatItem';

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
    return <SelfProfile stats={stats} followCounts={followCounts} profile={profile} />;
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

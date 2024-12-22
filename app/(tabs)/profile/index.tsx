import { View, Text } from 'react-native';
import { FlatList, Pressable } from 'react-native-gesture-handler';
import ProfileHeader from '~/components/Profile/ProfileHeader';
import { useAuthStore } from '~/stores/useAuth';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import SelfProfile from '~/components/Profile/SelfProfile';
import { profileService } from '~/services/profileService';

export default function Profile() {
  const profile = useAuthStore((state) => state.profile);
  if (!profile) return null;

  const [stats, setStats] = useState<UserStats>({
    totalJourneys: 0,
    recentJourneys: 0,
  });

  const [followCounts, setFollowCounts] = useState<{ followers: number; following: number }>({
    followers: 0,
    following: 0,
  });

  useEffect(() => {
    fetchStats();
    fetchFollowCounts();
  }, []);

  const fetchFollowCounts = async () => {
    const followCounts = await profileService.fetchFollowCounts(profile.id);
    setFollowCounts(followCounts);
  };

  const fetchStats = async () => {
    const stats = await profileService.fetchStats(profile.id);
    setStats(stats);
  };

  return <SelfProfile stats={stats} followCounts={followCounts} profile={profile} />;
}

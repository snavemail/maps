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
  const { profileID } = useLocalSearchParams();
  const self = useAuthStore((state) => state.user);
  const cachedProfile = useProfileCache().getProfile((profileID as string) || self?.id || '');
  const [profile, setProfile] = useState<ProfileWithStats | null>(null);
  const isOwnProfile = !profileID || profileID === self?.id;

  useEffect(() => {
    if (cachedProfile) {
      setProfile(cachedProfile);
    }
  }, [cachedProfile]);

  useEffect(() => {
    fetchProfile();
  }, [profileID]);

  const fetchProfile = async () => {
    const profileWithStats = await profileService.fetchProfile(
      (profileID as string) || self?.id || ''
    );
    setProfile(profileWithStats);
  };

  if (!profile) return null;

  if (isOwnProfile) {
    return <SelfProfile profile={profile} />;
  }

  // Other User's Profile View
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <ProfileHeader
        user={profile}
        journeyCount={profile.totalJourneys}
        followersCount={profile.followers}
        followingCount={profile.following}
      />

      <View className="mt-4 rounded-xl bg-white p-4 shadow-sm">
        <View className="flex-row justify-around">
          <StatItem icon="MapPin" label="Locations" value={profile.totalJourneys} />
          <StatItem icon="Calendar" label="Active Days" value={profile.recentJourneys} />
        </View>
      </View>

      {/* Recent Activity */}
      <View className="mt-4 rounded-xl bg-white p-4 shadow-sm">
        <Text className="mb-3 text-lg font-bold">Recent Activity</Text>
      </View>
    </ScrollView>
  );
}

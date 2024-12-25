import { View, Text, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useAuthStore } from '~/stores/useAuth';
import ProfileHeader from '~/components/Profile/ProfileHeader';
import { profileService } from '~/services/profileService';
import { useProfileCache } from '~/stores/useProfileCache';
import SelfProfile from '~/components/Profile/SelfProfile';
import StatItem from '~/components/Profile/StatItem';

export default function ProfilePage() {
  const { profileID } = useLocalSearchParams();
  const cachedProfile = useProfileCache().getProfile(profileID as string);
  const [profile, setProfile] = useState<ProfileWithStats | null>(null);

  useEffect(() => {
    if (cachedProfile) {
      setProfile(cachedProfile);
    }
  }, [cachedProfile]);

  useEffect(() => {
    if (!cachedProfile) {
      fetchProfile();
    }
  }, [profileID]);

  const fetchProfile = async () => {
    const profileWithStats = await profileService.fetchProfile(profileID as string);
    setProfile(profileWithStats);
  };

  if (!profile) return null;

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

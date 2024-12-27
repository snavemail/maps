import { Stack } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { createContext, useEffect, useState } from 'react';
import { profileService } from '~/services/profileService';
import { useProfileCache } from '~/stores/useProfileCache';

export default function ProfileLayout() {
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

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: true, title: 'Profile' }} />
      </Stack>
    </ProfileContext.Provider>
  );
}

export const ProfileContext = createContext<{
  profile: ProfileWithStats | null;
  setProfile: (profile: ProfileWithStats | null) => void;
}>({
  profile: null,
  setProfile: () => {},
});

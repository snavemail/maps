import { Stack } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { createContext, Suspense } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useUserProfile } from '~/hooks/useProfile';

interface ProfileContextType {
  profile: Profile | null;
  stats: FollowCounts | null;
  journeyStats: JourneyStats | null;
  isLoading: boolean;
}

export const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  stats: null,
  journeyStats: null,
  isLoading: false,
});

export default function ProfileLayout() {
  const { profileID } = useLocalSearchParams();

  return (
    <Suspense
      fallback={
        <View className="flex-1 items-center justify-center bg-surface dark:bg-surface-dark">
          <ActivityIndicator size="large" className="color-primary" />
        </View>
      }>
      <ProfileLayoutContent profileID={profileID as string} />
    </Suspense>
  );
}

function ProfileLayoutContent({ profileID }: { profileID: string }) {
  const { profile, stats, journeyStats, isLoading, error } = useUserProfile(profileID as string);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0f58a0" />
      </View>
    );
  }

  if (error || !profile) {
    return (
      <View className="flex-1 items-center justify-center bg-surface dark:bg-surface-dark">
        <Text className="text-text-secondary dark:text-text-dark-secondary">
          Could not load profile
        </Text>
      </View>
    );
  }

  return (
    <ProfileContext.Provider
      value={{
        profile,
        stats: stats ?? null,
        journeyStats: journeyStats ?? null,
        isLoading,
      }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="index"
          options={{
            headerShown: true,
            title: `${profile.first_name}'s Profile`,
            headerBackTitle: 'Back',
          }}
        />
      </Stack>
    </ProfileContext.Provider>
  );
}

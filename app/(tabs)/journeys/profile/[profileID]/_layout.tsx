import { Stack } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { useColorScheme } from 'nativewind';
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

export default function ProfileIDLayout() {
  const { profileID } = useLocalSearchParams();

  return (
    <Suspense
      fallback={
        <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark">
          <ActivityIndicator size="large" className="color-primary" />
        </View>
      }>
      <ProfileLayoutContent profileID={profileID as string} />
    </Suspense>
  );
}

function ProfileLayoutContent({ profileID }: { profileID: string }) {
  const { colorScheme } = useColorScheme();
  const { profile, stats, journeyStats, isLoading, error } = useUserProfile(profileID as string);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark">
        <ActivityIndicator size="large" color="#0f58a0" />
      </View>
    );
  }

  if (error || !profile) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark">
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
      <Stack
        screenOptions={{
          contentStyle: {
            backgroundColor: colorScheme === 'dark' ? '#2f2f2f' : '#fff',
          },
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#1f1f1f' : '#fff',
          },
          headerTitleStyle: {
            color: colorScheme === 'dark' ? '#f1f1f1' : '#000',
          },
          headerTintColor: colorScheme === 'dark' ? '#f1f1f1' : '#000',
        }}>
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

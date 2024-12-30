import { View, Text, Pressable, ScrollView, Switch } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuthStore } from '~/stores/useAuth';
import { useJourneyStore } from '~/stores/useJourney';
import ProfileAvatar from '~/components/Profile/ProfileAvatar';
import * as LucideIcons from 'lucide-react-native';
import { LucideIcon } from '~/components/LucideIcon';
import { useProfile } from '~/hooks/useProfile';
import { useNotificationStore } from '~/stores/useNotifications';
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { useColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';
import { usePreferenceStore } from '~/stores/usePreferences';

function EditProfileScreen() {
  const router = useRouter();
  const { profile } = useProfile();
  const signOut = useAuthStore((state) => state.signOut);
  const endJourney = useJourneyStore((state) => state.endJourney);
  const queryClient = useQueryClient();
  const theme = usePreferenceStore((state) => state.theme);
  const setTheme = usePreferenceStore((state) => state.setTheme);
  const { colorScheme } = useColorScheme();
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    setIsDarkTheme(theme === 'dark');
  }, [theme]);

  const onSignOut = () => {
    signOut();
    endJourney();
    console.log('clearing query client', queryClient);
    queryClient.clear();
    useNotificationStore.getState().resetNotifications();
  };

  if (!profile) {
    return (
      <Text>
        Sign in <Link href="/(auth)/signin">here</Link>
      </Text>
    );
  }

  const getEditFields = (
    profile: Profile
  ): {
    id: SingleEditableField;
    title: string;
    value: string | undefined;
    icon: keyof typeof LucideIcons;
  }[] => [
    {
      id: 'first_name',
      title: 'First Name',
      value: `${profile.first_name}`,
      icon: 'User',
    },
    {
      id: 'last_name',
      title: 'Last Name',
      value: profile.last_name,
      icon: 'User',
    },
    {
      id: 'bio',
      title: 'Bio',
      value: profile.bio,
      icon: 'Pencil',
    },
    {
      id: 'birthday',
      title: 'Birthday',
      value: profile.birthday
        ? new Date(profile.birthday).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : undefined,
      icon: 'Cake',
    },
    {
      id: 'is_public',
      title: 'Public Profile',
      value: profile.is_public ? 'Yes' : 'No',
      icon: 'Lock',
    },
  ];

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <ScrollView className="bg-background dark:bg-background-dark">
        <View className="items-center p-4">
          <ProfileAvatar userID={profile.id} profile={profile} />
        </View>

        <View className="bg-background dark:bg-background-dark">
          {getEditFields(profile).map((field) => (
            <Pressable
              key={field.id}
              className="flex-row items-center justify-between border-b border-gray-200  bg-background px-4 py-3 dark:border-gray-700 dark:bg-background-dark"
              onPress={() => router.push(`/(tabs)/me/edit/${field.id}`)}>
              <View className="flex-row items-center">
                <View className="w-6">
                  <LucideIcon
                    iconName={field.icon}
                    width={20}
                    height={20}
                    color={colorScheme === 'dark' ? '#ccc' : '#444'}
                  />
                </View>
                <View className="ml-3">
                  <Text className="text-sm text-gray dark:text-gray-dark">{field.title}</Text>
                  <Text className="text-text dark:text-text-dark">{field.value}</Text>
                </View>
              </View>
              <LucideIcon
                iconName="ChevronRight"
                size={20}
                color={colorScheme === 'dark' ? '#ccc' : '#444'}
              />
            </Pressable>
          ))}
        </View>

        <View className="mt-4 bg-background dark:bg-background-dark">
          <View className="flex-row items-center justify-between px-4 py-3">
            <View className="flex-row items-center">
              <View className="w-6">
                {isDarkTheme ? (
                  <LucideIcon
                    iconName="Moon"
                    width={20}
                    height={20}
                    color={colorScheme === 'dark' ? '#ccc' : '#444'}
                  />
                ) : (
                  <LucideIcon
                    iconName="Sun"
                    width={20}
                    height={20}
                    color={colorScheme === 'dark' ? '#ccc' : '#444'}
                  />
                )}
              </View>
              <Text className="ml-3 text-gray dark:text-gray-dark">
                {isDarkTheme ? 'Dark Mode' : 'Light Mode'}
              </Text>
            </View>
            <Switch
              value={isDarkTheme}
              onValueChange={(isDark) => {
                setIsDarkTheme(isDark);
                setTheme(isDark ? 'dark' : 'light');
              }}
              trackColor={{ false: '#767577', true: '#60A5FA' }}
              thumbColor={isDarkTheme ? '#0f58a0' : '#f4f3f4'}
            />
          </View>
        </View>

        <Pressable onPress={onSignOut}>
          <Text className="mt-4 text-center text-danger">Sign Out</Text>
        </Pressable>
        <Pressable onPress={onSignOut}>
          <Text className="mt-4 text-center text-danger">Delete Account</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

export default EditProfileScreen;

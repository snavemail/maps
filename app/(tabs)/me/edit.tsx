import { View, Text, Pressable, ScrollView, Switch, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuthStore } from '~/stores/useAuth';
import { useJourneyStore } from '~/stores/useJourney';
import ProfileAvatar from '~/components/Profile/ProfileAvatar';
import * as LucideIcons from 'lucide-react-native';
import { LucideIcon } from '~/components/LucideIcon';
import { useProfile } from '~/hooks/useProfile';
import { useNotificationStore } from '~/stores/useNotifications';
import { useQueryClient } from '@tanstack/react-query';

import { usePreferenceStore } from '~/stores/usePreferences';
import { useState } from 'react';
import { useColorScheme } from 'nativewind';

function EditProfileScreen() {
  const router = useRouter();
  const { profile } = useProfile();
  const signOut = useAuthStore((state) => state.signOut);
  const deleteAccount = useAuthStore((state) => state.deleteAccount);
  const endJourney = useJourneyStore((state) => state.endJourney);
  const queryClient = useQueryClient();
  const theme = usePreferenceStore((state) => state.theme);
  const setTheme = usePreferenceStore((state) => state.setTheme);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toggleColorScheme, colorScheme, setColorScheme } = useColorScheme();

  const handleThemeToggle = (isDark: boolean) => {
    toggleColorScheme();
    console.log(colorScheme);
    setTheme(isDark ? 'dark' : 'light');
  };

  const onSignOut = () => {
    signOut();
    endJourney();
    queryClient.clear();
    useNotificationStore.getState().resetNotifications();
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsDeleting(true);
              await deleteAccount();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete account. Please try again.');
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  if (!profile) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark">
        <Text className="text-center text-gray dark:text-gray-dark">
          Sign in <Link href="/(auth)/signin">here</Link>
        </Text>
      </View>
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
      value: profile.first_name,
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
                    color={theme === 'dark' ? '#ccc' : '#444'}
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
                color={theme === 'dark' ? '#ccc' : '#444'}
              />
            </Pressable>
          ))}
        </View>

        <View className="mt-4 bg-background dark:bg-background-dark">
          <View className="flex-row items-center justify-between px-4 py-3">
            <View className="flex-row items-center">
              <View className="w-6">
                <LucideIcon
                  iconName={theme === 'dark' ? 'Moon' : 'Sun'}
                  width={20}
                  height={20}
                  color={theme === 'dark' ? '#ccc' : '#444'}
                />
              </View>
              <Text className="ml-3 text-gray dark:text-gray-dark">
                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </Text>
            </View>
            <Switch
              value={theme === 'dark'}
              onValueChange={handleThemeToggle}
              trackColor={{ false: '#767577', true: '#60A5FA' }}
              thumbColor={theme === 'dark' ? '#0f58a0' : '#f4f3f4'}
            />
          </View>
        </View>

        <View className="mt-8 px-4">
          <Text className="text-lg font-semibold text-text dark:text-text-dark">
            Account Management
          </Text>
          <Pressable onPress={onSignOut}>
            <Text className="mt-4 text-center text-danger">Sign Out</Text>
          </Pressable>
          <Pressable onPress={handleDeleteAccount}>
            <Text className="mt-4 text-center text-danger">Delete Account</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

export default EditProfileScreen;

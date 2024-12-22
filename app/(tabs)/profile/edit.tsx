import { View, Text, Pressable, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuthStore } from '~/stores/useAuth';
import { useJourneyStore } from '~/stores/useJourney';
import { StyleURL } from '~/stores/usePreferences';
import ProfileAvatar from '~/components/ProfileAvatar';
import * as LucideIcons from 'lucide-react-native';
import { LucideIcon } from '~/components/LucideIcon';
import { useEffect, useState } from 'react';

function EditProfileScreen() {
  const router = useRouter();
  const profile = useAuthStore((state) => state.profile);
  const signOut = useAuthStore((state) => state.signOut);
  const endJourney = useJourneyStore((state) => state.endJourney);
  const [profileName, setProfileName] = useState(profile?.first_name);
  const onSignOut = () => {
    signOut();
    endJourney();
  };

  useEffect(() => {
    setProfileName(profile?.first_name);
  }, [profile]);

  if (!profile) {
    return (
      <Text>
        Sign in <Link href="/(auth)/signin">here</Link>
      </Text>
    );
  }

  const styleURLDisplayName: Record<StyleURL, string> = {
    [StyleURL.Street]: 'Street',
    [StyleURL.Dark]: 'Dark',
    [StyleURL.Light]: 'Light',
    [StyleURL.Outdoors]: 'Outdoors',
  };

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
      value: profile.birthday,
      icon: 'Cake',
    },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView>
        <View className="items-center border-b border-gray-200 bg-white p-4">
          <ProfileAvatar userID={profile.id} profile={profile} />
        </View>

        <View className="">
          <Text className="text-lg font-bold text-gray-900">
            Profile {profile.first_name} {profileName}
          </Text>
          {getEditFields(profile).map((field) => (
            <Pressable
              key={field.id}
              className="flex-row items-center justify-between border-b border-gray-200 bg-white px-4 py-3"
              onPress={() => router.push(`/profile/edit/${field.id}`)}>
              <View className="flex-row items-center">
                <View className="w-6">
                  <LucideIcon iconName={field.icon} width={20} height={20} color="#666" />
                </View>
                <View className="ml-3">
                  <Text className="text-sm text-gray-600">{field.title}</Text>
                  <Text className="text-gray-900">{field.value}</Text>
                </View>
              </View>
              <LucideIcon iconName="ChevronRight" size={20} color="#999" />
            </Pressable>
          ))}
        </View>
        <Pressable onPress={onSignOut}>
          <Text className="mt-4 text-center text-red-500">Sign Out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

export default EditProfileScreen;

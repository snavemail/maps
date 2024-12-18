import { View, Text, Pressable, ScrollView, Image } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useAuthStore } from '~/stores/useAuth';
import { useJourneyStore } from '~/stores/useJourney';
import { StyleURL, usePreferenceStore } from '~/stores/usePreferences';

function EditProfileScreen() {
  const router = useRouter();
  const profile = useAuthStore((state) => state.profile);
  const signOut = useAuthStore((state) => state.signOut);
  const endJourney = useJourneyStore((state) => state.endJourney);
  const mapTheme = usePreferenceStore((state) => state.mapTheme);
  const onSignOut = () => {
    signOut();
    endJourney();
  };
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

  const getMapThemeDisplayName = (url: StyleURL): string => {
    return styleURLDisplayName[url];
  };

  const editFields: {
    id: SingleEditableField;
    title: string;
    value: string | undefined;
    icon: React.ComponentProps<typeof FontAwesome>['name'];
  }[] = [
    {
      id: 'first_name',
      title: 'First Name',
      value: `${profile.first_name}`,
      icon: 'user',
    },
    {
      id: 'last_name',
      title: 'Last Name',
      value: profile.last_name,
      icon: 'user',
    },
    {
      id: 'bio',
      title: 'Bio',
      value: profile.bio,
      icon: 'pencil',
    },
    {
      id: 'birthday',
      title: 'Birthday',
      value: profile.birthday,
      icon: 'birthday-cake',
    },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView>
        <View className="items-center border-b border-gray-200 bg-white p-4">
          <Pressable onPress={() => console.log('photo change logic here!')}>
            <View className="relative">
              <Image
                source={{
                  uri:
                    profile.avatar_url ??
                    'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=620&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
                }}
                className="h-24 w-24 rounded-full"
              />
              <View className="absolute bottom-0 right-0 rounded-full bg-black/50 p-2">
                <FontAwesome name="camera" size={16} color="white" />
              </View>
            </View>
          </Pressable>
        </View>

        <View className="">
          {editFields.map((field) => (
            <Pressable
              key={field.id}
              className="flex-row items-center justify-between border-b border-gray-200 bg-white px-4 py-3"
              onPress={() => router.push(`/profile/edit/${field.id}`)}>
              <View className="flex-row items-center">
                <FontAwesome name={field.icon} size={20} color="#666" style={{ width: 24 }} />
                <View className="ml-3">
                  <Text className="text-sm text-gray-600">{field.title}</Text>
                  <Text className="text-gray-900">{field.value}</Text>
                </View>
              </View>
              <FontAwesome name="chevron-right" size={16} color="#999" />
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

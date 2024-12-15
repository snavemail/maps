import { View, Text } from 'react-native';
import { FlatList, Pressable } from 'react-native-gesture-handler';
import ProfileHeader from '~/components/ProfileHeader';
import { useAuthStore } from '~/stores/useAuth';
import { useRouter } from 'expo-router';

export default function Profile() {
  const profile = useAuthStore((state) => state.profile);
  if (!profile) return null;

  const router = useRouter();

  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.toString()}
        contentContainerStyle={{ gap: 3 }}
        ListHeaderComponent={<ProfileHeader user={profile} />}
        renderItem={({ item }) => <Text>{item}</Text>}
      />
      <Pressable
        onPress={() => router.push('/(tabs)/profile/0f3c2f58-c887-4ecf-8a44-9af3aad83006')}>
        <Text> Go to profile</Text>
      </Pressable>
    </View>
  );
}

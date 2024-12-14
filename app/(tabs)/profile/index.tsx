import { View, Text } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import ProfileHeader from '~/components/ProfileHeader';
import { useAuthStore } from '~/stores/useAuth';

export default function Profile() {
  const profile = useAuthStore((state) => state.profile);
  if (!profile) return null;

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
    </View>
  );
}

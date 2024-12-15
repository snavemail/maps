import { View, Text, ActivityIndicator } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import ProfileHeader from '~/components/ProfileHeader';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { profileService } from '~/services/profileService';

export default function ProfileByID() {
  const { slug } = useLocalSearchParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  useEffect(() => {
    const fetchProfileByID = async () => {
      setLoading(true);
      const profile = await profileService.getById(slug as string);
      setProfile(profile);
      setLoading(false);
    };
    fetchProfileByID();
  }, []);

  if (loading) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }

  if (!profile) {
    return <Text>User not found</Text>;
  }

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

import { Stack, useRouter } from 'expo-router';
import { BookUser } from 'lucide-react-native';
import { Pressable } from 'react-native';

export default function ProfileLayout() {
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: 'Profile',
          headerRight: () => (
            <Pressable onPress={() => router.push('/(tabs)/me/add-user')} hitSlop={10}>
              <BookUser size={24} color="black" />
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          title: 'Edit Profile',
          headerBackButtonDisplayMode: 'minimal',
        }}
      />
      <Stack.Screen name="edit/[field]" />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen
        name="add-user"
        options={{ headerShown: true, title: 'Add User', animation: 'slide_from_right' }}
      />
    </Stack>
  );
}

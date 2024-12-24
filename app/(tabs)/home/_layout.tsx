import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: true, title: 'Home' }} />
      <Stack.Screen name="profile/[profileID]" options={{ headerShown: true, title: 'Profile' }} />
    </Stack>
  );
}

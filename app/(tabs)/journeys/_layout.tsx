import { Stack } from 'expo-router';

export default function JourneysLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: true, title: 'Journeys' }} />
      <Stack.Screen name="profile/[profileID]" options={{ headerShown: true, title: 'Profile' }} />
    </Stack>
  );
}

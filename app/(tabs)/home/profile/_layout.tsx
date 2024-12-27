import { Stack } from 'expo-router';
export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[profileID]" options={{ headerShown: false, title: 'Profile' }} />
      <Stack.Screen
        name="connections/[profileID]"
        options={{ headerShown: true, animation: 'slide_from_right', title: 'Connections' }}
      />
    </Stack>
  );
}

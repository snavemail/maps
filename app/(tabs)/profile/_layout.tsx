import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: true, title: 'Profile' }} />
      <Stack.Screen
        name="edit"
        options={{
          title: 'Edit Profile',
          headerBackButtonDisplayMode: 'minimal',
        }}
      />
      <Stack.Screen name="edit/[field]" />
      <Stack.Screen
        name="[slug]"
        options={() => ({
          headerShown: true,
          title: 'Profile',
          headerBackTitle: 'Back',
        })}
      />
    </Stack>
  );
}

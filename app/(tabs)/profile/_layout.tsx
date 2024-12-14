import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="edit"
        options={{
          title: 'Edit Profile',
          headerBackButtonDisplayMode: 'minimal',
        }}
      />
      <Stack.Screen
        name="edit/[field]"
        options={({ route }) => ({
          title: `Edit ${route.params?.field || 'Field'}`,
        })}
      />
    </Stack>
  );
}

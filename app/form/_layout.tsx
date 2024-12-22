import { Stack } from 'expo-router';

export default function AddLocationLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_bottom',
      }}>
      <Stack.Screen
        name="[slug]"
        options={{
          title: 'Add Location',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="publish"
        options={{
          title: 'Save Journey',
          gestureEnabled: false,
          animation: 'slide_from_bottom',
          headerShown: false,
        }}
      />
    </Stack>
  );
}

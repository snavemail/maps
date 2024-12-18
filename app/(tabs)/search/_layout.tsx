import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
      }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Search',
          animation: 'fade',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="results"
        options={{
          title: 'Results',
          animation: 'slide_from_bottom',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[slug]"
        options={{
          title: 'Slug',
          animation: 'slide_from_bottom',
          headerShown: true,
        }}
      />
    </Stack>
  );
}

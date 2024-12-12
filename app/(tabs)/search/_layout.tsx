import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Search',
          animation: 'fade',
        }}
      />
      <Stack.Screen
        name="results"
        options={{
          title: 'Results',
          animation: 'fade',
        }}
      />
    </Stack>
  );
}

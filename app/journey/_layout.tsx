import { Stack } from 'expo-router';

export default function JourneyLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_left',
      }}>
      <Stack.Screen
        name="[slug]"
        options={{
          title: 'Journey',
          headerShown: false,
        }}
      />
    </Stack>
  );
}

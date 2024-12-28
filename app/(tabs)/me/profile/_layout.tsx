import { Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';
export default function ProfileLayout() {
  const { colorScheme } = useColorScheme();
  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1f1f1f' : '#fff',
        },
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1f1f1f' : '#fff',
        },
        headerTitleStyle: {
          color: colorScheme === 'dark' ? '#f1f1f1' : '#000',
        },
        headerTintColor: colorScheme === 'dark' ? '#f1f1f1' : '#000',
      }}>
      <Stack.Screen name="[profileID]" options={{ headerShown: false }} />
      <Stack.Screen
        name="connections/[profileID]"
        options={{ headerShown: true, animation: 'slide_from_right', title: 'Connections' }}
      />
    </Stack>
  );
}

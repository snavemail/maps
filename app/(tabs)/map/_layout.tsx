import { Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';
export default function MapLayout() {
  const { colorScheme } = useColorScheme();
  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: colorScheme === 'dark' ? '#2f2f2f' : '#fff',
        },
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1f1f1f' : '#fff',
        },
        headerTitleStyle: {
          color: colorScheme === 'dark' ? '#f1f1f1' : '#000',
        },
        headerTintColor: colorScheme === 'dark' ? '#f1f1f1' : '#000',
      }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}

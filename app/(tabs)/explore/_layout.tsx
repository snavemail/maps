import { Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';

export default function AuthLayout() {
  const { colorScheme } = useColorScheme();
  return (
    <Stack
      screenOptions={{
        headerShown: true,
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
          animation: 'slide_from_bottom',
          headerShown: true,
        }}
      />
    </Stack>
  );
}

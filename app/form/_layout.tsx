import { Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';
export default function AddLocationLayout() {
  const { colorScheme } = useColorScheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_bottom',
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

import { router, Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { TouchableOpacity, Text } from 'react-native';

export default function JourneysLayout() {
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
      <Stack.Screen name="index" options={{ headerShown: true, title: 'Journeys' }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen
        name="journey/[journeyID]"
        options={{
          headerShown: false,
          title: 'Journey',
          animation: 'slide_from_right',
        }}
      />
    </Stack>
  );
}

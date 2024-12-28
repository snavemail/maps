import { Stack, Redirect } from 'expo-router';
import { useAuthStore } from '~/stores/useAuth';

export default function AuthLayout() {
  const session = useAuthStore((state) => state.session);
  const user = useAuthStore((state) => state.user);

  if (session && user) {
    return <Redirect href="/(tabs)/map" />;
  }

  return (
    <Stack>
      <Stack.Screen name="signin" options={{ headerShown: false, animation: 'fade' }} />
      <Stack.Screen name="signup" options={{ headerShown: false, animation: 'fade' }} />
    </Stack>
  );
}

import { ActivityIndicator, StatusBar, View } from 'react-native';
import '../global.css';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRouter, Stack, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { useAuthStore } from '~/stores/useAuth';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const session = useAuthStore((state) => state.session);
  const initialized = useAuthStore((state) => state.initialized);
  const loading = useAuthStore((state) => state.loading);

  useEffect(() => {
    if (!initialized || loading) return;
    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      router.replace('/(auth)/signin');
    } else if (session && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [session, initialized, loading]);

  return <>{children}</>;
}

function Layout() {
  const initialize = useAuthStore((state) => state.initialize);
  const initialized = useAuthStore((state) => state.initialized);
  const loading = useAuthStore((state) => state.loading);

  useEffect(() => {
    initialize();
  }, []);

  if (!initialized || loading) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <>
      <StatusBar barStyle={'dark-content'} />
      <AuthGuard>
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="journey"
            options={{
              gestureEnabled: false,
              animation: 'slide_from_bottom',
              headerShown: false,
            }}
          />
        </Stack>
      </AuthGuard>
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Layout />
    </GestureHandlerRootView>
  );
}

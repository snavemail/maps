import { ActivityIndicator, StatusBar, View } from 'react-native';
import '../global.css';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRouter, Stack, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { useAuthStore } from '~/stores/useAuth';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const session = useAuthStore((state) => state.session);
  const initialized = useAuthStore((state) => state.initialized);
  const loading = useAuthStore((state) => state.loading);

  useEffect(() => {
    if (!initialized || loading) {
      console.log('loading...');
      return;
    }
    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      console.log(segments);
      console.log('replacing to signin');
      router.replace('/(auth)/signin');
    } else if (session && inAuthGroup) {
      console.log(segments);
      console.log('replacing to tabs');
      router.replace('/(tabs)');
    } else {
      console.log('no need to redirect');
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
      <View className="flex flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle={'dark-content'} />
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

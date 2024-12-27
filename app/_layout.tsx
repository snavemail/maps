import { ActivityIndicator, StatusBar, View } from 'react-native';
import '../global.css';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import React, { useEffect, useMemo } from 'react';
import { useAuthStore } from '~/stores/useAuth';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const unstable_settings = {
  initialRouteName: '(tabs)/map',
};

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

function Layout() {
  const initialize = useAuthStore((state) => state.initialize);
  const initialized = useAuthStore((state) => state.initialized);
  const loading = useAuthStore((state) => state.loading);
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 30, // 30 minutes
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
          },
        },
      }),
    []
  );

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
    <QueryClientProvider client={queryClient}>
      <StatusBar barStyle={'dark-content'} />

      <Stack screenOptions={{ contentStyle: { backgroundColor: 'white' } }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="form"
          options={{
            gestureEnabled: false,
            animation: 'slide_from_bottom',
            headerShown: false,
          }}
        />
      </Stack>
      <Toast />
    </QueryClientProvider>
  );
}

export default function RootLayout() {
  return (
    <ActionSheetProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Layout />
      </GestureHandlerRootView>
    </ActionSheetProvider>
  );
}

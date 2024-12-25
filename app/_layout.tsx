import { ActivityIndicator, StatusBar, View } from 'react-native';
import '../global.css';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { useAuthStore } from '~/stores/useAuth';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';

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

      <Stack screenOptions={{ contentStyle: { backgroundColor: 'white' } }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
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

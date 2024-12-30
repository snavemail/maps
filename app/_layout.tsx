import { ActivityIndicator, StatusBar, View, Text, Button, Platform } from 'react-native';
import '../global.css';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '~/stores/useAuth';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import Toast, { BaseToast } from 'react-native-toast-message';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useColorScheme } from 'nativewind';
import { Appearance, useColorScheme as useColorSchemeNative } from 'react-native';
import { usePreferenceStore } from '~/stores/usePreferences';

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

  const { colorScheme, setColorScheme } = useColorScheme();
  const nativeColorScheme = useColorSchemeNative();
  const theme = usePreferenceStore((state) => state.theme);
  const setTheme = usePreferenceStore((state) => state.setTheme);
  const [key, setKey] = useState(0);

  // Debug logging
  useEffect(() => {
    console.log('Theme State:', {
      nativewind: colorScheme,
      system: nativeColorScheme,
      appearance: Appearance.getColorScheme(),
      store: theme,
    });
  }, [colorScheme, nativeColorScheme, theme]);

  // Sync store theme with NativeWind
  useEffect(() => {
    console.log('Syncing theme:', theme);
    if (Platform.OS === 'ios') {
      setColorScheme('dark');
      // Force update on iOS
      console.log('updating color scheme on ios');
      requestAnimationFrame(() => {
        console.log('updating color scheme on ios second');
        setColorScheme('dark');
        setKey((prevKey) => prevKey + 1);
      });
    } else {
      setColorScheme(theme);
    }
  }, [theme]);

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
      <StatusBar
        backgroundColor={colorScheme === 'dark' ? '#1f1f1f' : '#fff'}
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <Stack
        screenOptions={{
          contentStyle: {
            backgroundColor: 'transparent',
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
      <Toast
        config={{
          success: (props) => (
            <BaseToast
              {...props}
              style={{
                borderLeftColor: colorScheme === 'dark' ? '#0284C7' : '#0f58a0',
                backgroundColor: colorScheme === 'dark' ? '#13151a' : '#FFFFFF',
                borderColor: colorScheme === 'dark' ? '#334155' : '#E2E8F0',
              }}
              contentContainerStyle={{ paddingHorizontal: 15 }}
              text1Style={{
                fontSize: 15,
                fontWeight: '400',
                color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A',
              }}
              text2Style={{
                fontSize: 13,
                color: colorScheme === 'dark' ? '#CBD5E1' : '#64748B',
              }}
            />
          ),
          error: (props) => (
            <BaseToast
              {...props}
              style={{
                borderLeftColor: colorScheme === 'dark' ? '#FB7185' : '#EF4444',
                backgroundColor: colorScheme === 'dark' ? '#13151a' : '#FFFFFF',
                borderColor: colorScheme === 'dark' ? '#334155' : '#E2E8F0',
              }}
              contentContainerStyle={{ paddingHorizontal: 15 }}
              text1Style={{
                fontSize: 15,
                fontWeight: '400',
                color: colorScheme === 'dark' ? '#F8FAFC' : '#0F172A',
              }}
              text2Style={{
                fontSize: 13,
                color: colorScheme === 'dark' ? '#CBD5E1' : '#64748B',
              }}
            />
          ),
        }}
      />
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

import { Redirect, Tabs } from 'expo-router';

import { TabBarIcon } from '~/components/TabBarIcon';
import { useAuthStore } from '~/stores/useAuth';
import { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { useUserLocationStore } from '~/stores/useUserLocation';
import { useProfile } from '~/hooks/useProfile';
import { useColorScheme } from 'nativewind';

export default function TabLayout() {
  const session = useAuthStore((state) => state.session);
  const user = useAuthStore((state) => state.user);
  const { profile } = useProfile();
  const { fetchUserLocation, userLocation } = useUserLocationStore();
  const startLocationUpdates = useUserLocationStore((state) => state.startTrackingUserLocation);
  const { colorScheme } = useColorScheme();

  useEffect(() => {
    startLocationUpdates();
  }, [startLocationUpdates]);

  useEffect(() => {
    fetchUserLocation();
  }, [fetchUserLocation]);

  if (!userLocation) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark">
        <Text className="text-text dark:text-text-dark">Fetching location...</Text>
      </View>
    );
  }

  if (!session || !user) {
    return <Redirect href="/(auth)/signin" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1f1f1f' : '#fff',
        },
        tabBarActiveTintColor: colorScheme === 'dark' ? '#38BDF8' : '#0f58a0',
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#ccc' : '#444',
      }}>
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabBarIcon iconName="Home" focused={focused} size={24} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon iconName="Compass" focused={focused} size={24} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          headerShown: false,
          title: 'Excurse',
          tabBarIcon: ({ focused }) => <TabBarIcon iconName="Map" focused={focused} size={24} />,
        }}
      />
      <Tabs.Screen
        name="journeys"
        options={{
          title: 'Journeys',
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabBarIcon iconName="Route" focused={focused} size={24} />,
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          headerShown: false,
          title: 'Me',
          tabBarIcon: ({ focused }) =>
            profile?.avatar_url ? (
              <View className="flex h-16 w-full flex-row items-center justify-center">
                <Image
                  source={{ uri: profile.avatar_url }}
                  className={`h-8 w-8 rounded-full border-2  ${
                    focused ? 'border-primary' : 'border-transparent'
                  }`}
                />
              </View>
            ) : (
              <TabBarIcon iconName="CircleUserRound" focused={focused} size={24} />
            ),
        }}
      />
    </Tabs>
  );
}

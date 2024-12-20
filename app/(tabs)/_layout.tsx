import { Redirect, Tabs } from 'expo-router';

import { TabBarIcon2 } from '../../components/TabBarIcon';
import { useAuthStore } from '~/stores/useAuth';
import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useUserLocationStore } from '~/stores/useUserLocation';

export default function TabLayout() {
  const session = useAuthStore((state) => state.session);
  const user = useAuthStore((state) => state.user);
  const { fetchUserLocation, userLocation } = useUserLocationStore();
  const startLocationUpdates = useUserLocationStore((state) => state.startTrackingUserLocation);

  useEffect(() => {
    startLocationUpdates(); // Start listening for location updates
  }, [startLocationUpdates]);

  useEffect(() => {
    fetchUserLocation();
  }, [fetchUserLocation]);

  if (!userLocation) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Fetching location...</Text>
      </View>
    );
  }

  if (!session || !user) {
    return <Redirect href="/(auth)/signin" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'black',
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon2 activeName="home" inactiveName="home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon2 activeName="compass" inactiveName="compass" focused={focused} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          headerShown: false,
          title: 'Excurse',
          tabBarIcon: ({ focused }) => <TabBarIcon2 activeName="map" focused={focused} size={24} />,
        }}
      />
      <Tabs.Screen
        name="journeys"
        options={{
          title: 'Journeys',
          tabBarIcon: ({ focused }) => <TabBarIcon2 activeName="bookmark" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: 'Profile',
          tabBarIcon: ({ focused }) => <TabBarIcon2 activeName="user" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

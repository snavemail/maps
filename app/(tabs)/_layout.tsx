import { Redirect, Tabs } from 'expo-router';

import { TabBarIcon2 } from '../../components/TabBarIcon';
import { useAuthStore } from '~/stores/useAuth';

export default function TabLayout() {
  const session = useAuthStore((state) => state.session);
  const user = useAuthStore((state) => state.user);

  if (!session || !user) {
    return <Redirect href="/(auth)/signin" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'black',
      }}>
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon2 activeName="home" inactiveName="home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon2 activeName="search" inactiveName="search" focused={focused} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: 'Maps',
          tabBarIcon: ({ focused }) => <TabBarIcon2 activeName="map" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
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

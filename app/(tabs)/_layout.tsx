import { Link, Tabs } from 'expo-router';

import { TabBarIcon, TabBarIcon2 } from '../../components/TabBarIcon';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'black',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Maps',
          tabBarIcon: ({ focused }) => <TabBarIcon2 activeName="map" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <TabBarIcon2 activeName="user" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

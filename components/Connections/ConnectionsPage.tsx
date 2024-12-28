import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Connections from '~/components/Connections/Connections';
import { useColorScheme } from 'nativewind';

const Tab = createMaterialTopTabNavigator();

export default function ConnectionsPage({
  userID,
  initialTab,
}: {
  userID: string;
  initialTab: string;
}) {
  const { colorScheme } = useColorScheme();
  return (
    <Tab.Navigator
      initialRouteName={initialTab}
      screenOptions={{
        tabBarActiveTintColor: colorScheme === 'dark' ? '#0284C7' : '#0f58a0',
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#ccc' : '#444',
        tabBarIndicatorStyle: { backgroundColor: colorScheme === 'dark' ? '#0284C7' : '#0f58a0' },
        tabBarStyle: { backgroundColor: colorScheme === 'dark' ? '#2f2f2f' : '#f1f1f1' },
        tabBarLabelStyle: { fontSize: 14, fontWeight: '600', textTransform: 'none' },
        tabBarPressColor: '#E0EFFF',
      }}>
      <Tab.Screen
        name="Followers"
        options={{
          title: 'Followers',
        }}>
        {() => <Connections userID={userID} connectionType="followers" />}
      </Tab.Screen>
      <Tab.Screen
        name="Following"
        options={{
          title: 'Following',
        }}>
        {() => <Connections userID={userID} connectionType="following" />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

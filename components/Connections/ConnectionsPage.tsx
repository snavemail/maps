import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Following from '~/components/Connections/Following';
import Followers from '~/components/Connections/Followers';

const Tab = createMaterialTopTabNavigator();

export default function ConnectionsPage({
  userID,
  initialTab,
}: {
  userID: string;
  initialTab: string;
}) {
  return (
    <Tab.Navigator
      initialRouteName={initialTab}
      screenOptions={{
        tabBarActiveTintColor: '#0f58a0',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarIndicatorStyle: { backgroundColor: '#0f58a0' },
        tabBarStyle: { backgroundColor: '#FFFFFF' },
        tabBarLabelStyle: { fontSize: 14, fontWeight: '600', textTransform: 'none' },
        tabBarPressColor: '#E0EFFF',
      }}>
      <Tab.Screen
        name="Followers"
        options={{
          title: 'Followers',
        }}>
        {() => <Followers userID={userID} />}
      </Tab.Screen>
      <Tab.Screen
        name="Following"
        options={{
          title: 'Following',
        }}>
        {() => <Following userID={userID} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

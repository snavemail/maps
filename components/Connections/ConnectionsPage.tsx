import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Following from './Following';
import Followers from './Followers';

export default function ConnectionsPage() {
  const Tab = createMaterialTopTabNavigator();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#0fa00f',
        tabBarInactiveTintColor: '#c4c4c4',
        tabBarIndicatorStyle: { backgroundColor: '#0fa00f' },
        tabBarStyle: { backgroundColor: 'white' },
        tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
      }}>
      <Tab.Screen
        name="Followers"
        component={Followers}
        options={{
          title: 'Followers',
        }}
      />
      <Tab.Screen
        name="Following"
        component={Following}
        options={{
          title: 'Following',
        }}
      />
    </Tab.Navigator>
  );
}

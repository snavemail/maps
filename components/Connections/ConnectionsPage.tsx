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
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#c4c4c4',
        tabBarIndicatorStyle: { backgroundColor: '#000' },
        tabBarStyle: { backgroundColor: 'white' },
        tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
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

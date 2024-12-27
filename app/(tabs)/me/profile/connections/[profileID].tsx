import React from 'react';
import ConnectionsPage from '~/components/Connections/ConnectionsPage';
import { useLocalSearchParams } from 'expo-router';

export default function Connections() {
  const { profileID } = useLocalSearchParams();
  const { tab } = useLocalSearchParams<{ tab: 'Followers' | 'Following' }>();
  if (!profileID) return null;
  return <ConnectionsPage userID={profileID as string} initialTab={tab} />;
}

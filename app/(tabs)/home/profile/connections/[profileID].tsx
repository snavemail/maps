import React, { useContext } from 'react';
import ConnectionsPage from '~/components/Connections/ConnectionsPage';
import { ProfileContext } from '~/app/(tabs)/me/profile/[profileID]/_layout';
import { useLocalSearchParams } from 'expo-router';

export default function Connections() {
  const { profileID } = useLocalSearchParams();
  const { tab } = useLocalSearchParams<{ tab: 'Followers' | 'Following' }>();
  if (!profileID) return null;
  return <ConnectionsPage userID={profileID as string} initialTab={tab} />;
}

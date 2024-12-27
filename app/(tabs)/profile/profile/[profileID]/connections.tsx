import React, { useContext } from 'react';
import ConnectionsPage from '~/components/Connections/ConnectionsPage';
import { ProfileContext } from './_layout';
import { useLocalSearchParams } from 'expo-router';

export default function Connections() {
  const { profile } = useContext(ProfileContext);
  const { tab } = useLocalSearchParams<{ tab: 'Followers' | 'Following' }>();
  if (!profile) return null;
  return <ConnectionsPage userID={profile.id} initialTab={tab} />;
}

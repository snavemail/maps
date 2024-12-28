import React, { useContext } from 'react';
import ProfilePage from '~/components/Profile/ProfilePage';
import { ProfileContext } from './_layout';

export default function ProfileScreen() {
  const { profile, journeyStats } = useContext(ProfileContext);
  if (!profile || !journeyStats) return null;

  return <ProfilePage profile={profile} journeyStats={journeyStats} />;
}

import React, { useContext } from 'react';
import ProfilePage from '~/components/Profile/ProfilePage';
import { ProfileContext } from './_layout';

export default function ProfileScreen() {
  const { profile } = useContext(ProfileContext);
  if (!profile) return null;
  return <ProfilePage profile={profile} />;
}

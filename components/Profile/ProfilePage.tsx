import React from 'react';
import ProfileHeader from '~/components/Profile/ProfileHeader';
import { UserJourneys } from '~/components/UserJourneys';
import { useCanViewProfile } from '~/hooks/useCanViewProfile';
import PrivateProfileMessage from '~/components/Profile/PrivateProfileMessage';

export default function ProfilePage({ profile }: { profile: Profile }) {
  const canViewProfile = useCanViewProfile(profile.id);
  return canViewProfile ? (
    <UserJourneys userId={profile.id} header={<ProfileHeader user={profile} />} />
  ) : (
    <>
      <ProfileHeader user={profile} />
      <PrivateProfileMessage />
    </>
  );
}

import { useAuthStore } from '~/stores/useAuth';
import { useEffect, useState } from 'react';
import SelfProfile from '~/components/Profile/SelfProfile';
import { profileService } from '~/services/profileService';
import { useProfileCache } from '~/stores/useProfileCache';
export default function Profile() {
  const profileID = useAuthStore((state) => state.profile)?.id;
  if (!profileID) return null;
  const cachedProfile = useProfileCache().getProfile(profileID);
  const [profile, setProfile] = useState<ProfileWithStats | null>(null);

  useEffect(() => {
    if (cachedProfile) {
      setProfile(cachedProfile);
    }
  }, [cachedProfile]);

  useEffect(() => {
    fetchProfile();
  }, [profileID]);

  const fetchProfile = async () => {
    const profileWithStats = await profileService.fetchProfile(profileID);
    setProfile(profileWithStats);
  };

  if (!profile) return null;

  return <SelfProfile profile={profile} />;
}

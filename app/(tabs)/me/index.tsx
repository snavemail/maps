import SelfProfile from '~/components/Profile/SelfProfile';
import { useProfile } from '~/hooks/useProfile';

export default function Profile() {
  const { profile } = useProfile();
  if (!profile) return null;

  return <SelfProfile profile={profile} />;
}

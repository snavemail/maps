import { useQuery } from '@tanstack/react-query';
import { supabase } from '~/lib/supabase';
import { useAuthStore } from '~/stores/useAuth';

export function useCanViewProfile(profileID: string) {
  const self = useAuthStore((state) => state.user);
  const { data } = useQuery({
    queryKey: ['canViewProfile', profileID],
    queryFn: async () => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_public')
        .eq('id', profileID)
        .single();

      if (profileID === self?.id) {
        return true;
      }

      if (profile?.is_public) {
        return true;
      }

      const { data: isFollowing } = await supabase
        .from('followers')
        .select('id')
        .eq('follower_id', self?.id)
        .eq('following_id', profileID)
        .single();

      return !!isFollowing;
    },
    enabled: !!profileID && !!self?.id,
  });

  return data ?? false;
}

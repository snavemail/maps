import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '~/services/profileService';
import { useAuthStore } from '~/stores/useAuth';

export const useProfile = () => {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const targetUserID = user?.id;

  const profileQuery = useQuery({
    queryKey: ['profile', targetUserID],
    queryFn: () => profileService.fetchProfile(targetUserID!),
    enabled: !!targetUserID,
    staleTime: 1000 * 60 * 5,
  });

  const statsQuery = useQuery({
    queryKey: ['profileStats', targetUserID],
    queryFn: () => profileService.fetchProfileStats(targetUserID!),
    enabled: !!targetUserID,
    staleTime: 0,
  });

  const journeyStatsQuery = useQuery({
    queryKey: ['journeyStats', targetUserID],
    queryFn: () => profileService.fetchJourneyStats(targetUserID!),
    enabled: !!targetUserID,
    staleTime: 0,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (updates: Partial<EditableProfile>) =>
      profileService.update(targetUserID!, updates),
    onSuccess: (newProfile) => {
      queryClient.setQueryData(['profile', targetUserID], newProfile);
    },
  });

  return {
    profile: profileQuery.data,
    stats: statsQuery.data,
    journeyStats: journeyStatsQuery.data,
    isLoading: profileQuery.isLoading || statsQuery.isLoading || journeyStatsQuery.isLoading,
    error: profileQuery.error || statsQuery.error || journeyStatsQuery.error,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
  };
};

export function useUserProfile(userID: string) {
  const profileQuery = useQuery({
    queryKey: ['profile', userID],
    queryFn: () => profileService.fetchProfile(userID),
    enabled: !!userID,
    staleTime: 0,
  });

  const statsQuery = useQuery({
    queryKey: ['profileStats', userID],
    queryFn: () => profileService.fetchProfileStats(userID),
    enabled: !!userID && !!profileQuery.data,
  });

  const journeyStatsQuery = useQuery({
    queryKey: ['journeyStats', userID],
    queryFn: () => profileService.fetchJourneyStats(userID),
    enabled: !!userID && !!profileQuery.data,
  });

  return {
    profile: profileQuery.data,
    stats: statsQuery.data,
    journeyStats: journeyStatsQuery.data,
    isLoading: profileQuery.isLoading || statsQuery.isLoading || journeyStatsQuery.isLoading,
    error: profileQuery.error || statsQuery.error || journeyStatsQuery.error,
  };
}

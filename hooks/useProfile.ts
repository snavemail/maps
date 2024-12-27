import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '~/services/profileService';
import { useAuthStore } from '~/stores/useAuth';

export const useProfile = () => {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => profileService.fetchProfile(user?.id!),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 60 * 1, // 1 hour
    gcTime: 1000 * 60 * 30, // 30 minutes
  });

  const updateProfileMutation = useMutation({
    mutationFn: (updates: Partial<EditableProfile>) => profileService.update(user?.id!, updates),
    onSuccess: (newProfile) => {
      queryClient.setQueryData(['profile', user?.id], newProfile);
    },
  });

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    error: profileQuery.error,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
  };
};

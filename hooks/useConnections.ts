import { followService } from '~/services/followService';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useProfile } from '~/hooks/useProfile';

export function useFollowers(profileId: string) {
  const { profile: currentUser } = useProfile(); // Currently logged in user

  return useInfiniteQuery<FollowResponse>({
    queryKey: ['followers', profileId],
    queryFn: ({ pageParam = 0 }) =>
      followService.getFollowers(profileId, currentUser!.id, pageParam as number),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.has_more) return undefined;
      return allPages.length;
    },
    enabled: !!currentUser?.id,
    initialPageParam: 0,
  });
}

export function useFollowing(profileId: string) {
  const { profile: currentUser } = useProfile();

  return useInfiniteQuery<FollowResponse>({
    queryKey: ['following', profileId],
    queryFn: ({ pageParam = 0 }) =>
      followService.getFollowing(profileId, currentUser!.id, pageParam as number),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.has_more) return undefined;
      return allPages.length;
    },
    enabled: !!currentUser?.id,
    initialPageParam: 0,
  });
}

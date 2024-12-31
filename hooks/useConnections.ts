import { followService } from '~/services/followService';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useProfile } from '~/hooks/useProfile';

export function useFollowers(profileID: string) {
  const { profile: currentUser } = useProfile();

  return useInfiniteQuery<FollowResponse>({
    queryKey: ['followers', profileID],
    queryFn: ({ pageParam = 0 }) =>
      followService.getFollowers(profileID, currentUser!.id, pageParam as number),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.has_more) return undefined;
      return allPages.length;
    },
    enabled: !!currentUser?.id,
    initialPageParam: 0,
  });
}

export function useFollowing(profileID: string) {
  const { profile: currentUser } = useProfile();

  return useInfiniteQuery<FollowResponse>({
    queryKey: ['following', profileID],
    queryFn: ({ pageParam = 0 }) =>
      followService.getFollowing(profileID, currentUser!.id, pageParam as number),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.has_more) return undefined;
      if (!allPages) {
        console.log('allPages caused error');
        return 0;
      }
      return allPages.length;
    },
    enabled: !!currentUser?.id,
    initialPageParam: 0,
  });
}
